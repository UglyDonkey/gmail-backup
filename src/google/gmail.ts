import {Auth, gmail_v1, google} from 'googleapis'
import {ReadableStream, TransformStream} from 'node:stream/web'
import {QUEUING_STRATEGY, reverseStream} from '../common'

export type Message = gmail_v1.Schema$Message
export type Profile = gmail_v1.Schema$Profile
export type Attachment = gmail_v1.Schema$MessagePartBody
export type Label =  gmail_v1.Schema$Label

const LIST_PARAMS = {userId: 'me', maxResults: 500}

export interface MessageWithAttachments {
  message: Message,
  attachments: Attachment[]
}

export class Gmail {
  constructor(private gmail: gmail_v1.Gmail) {}

  async getProfile(): Promise<Profile> {
    const {data: profile} = await this.gmail.users.getProfile({userId: 'me'})
    return profile
  }

  getEmailReader(setTotal?: (total: number) => void, lastMessageId?: string): ReadableStream<MessageWithAttachments> {
    let total = 0
    const mailIdsStream = new ReadableStream<string>({
      start: async controller => {
        let nextPageToken: string | undefined

        do {
          const {data: mailIds} = await this.gmail.users.messages.list({...LIST_PARAMS, pageToken: nextPageToken})
          nextPageToken = mailIds.nextPageToken ?? undefined
          const lastMessageIndex = mailIds.messages?.findIndex(message => message.id === lastMessageId) ?? -1
          if (lastMessageIndex !== -1) {
            mailIds.messages = mailIds.messages?.slice(0, lastMessageIndex)
            nextPageToken = undefined
          }

          mailIds.messages?.forEach(message => controller.enqueue(message.id!))

          total += mailIds.messages?.length ?? 0
          setTotal?.(total)
        } while (nextPageToken)

        controller.close()
      },
    })

    const fetchMailsStream = new TransformStream<string, Message>({
      transform: async (messageId, controller) => {
        const {data: message} = await this.gmail.users.messages.get({userId: 'me', id: messageId})
        controller.enqueue(message)
      },
    }, QUEUING_STRATEGY, QUEUING_STRATEGY)

    const fetchAttachmentsStream = new TransformStream<Message, MessageWithAttachments>({
      transform: async (message, controller) => {
        const attachments = await Promise.all(message.payload?.parts
          ?.filter(part =>
            part.headers?.some(header =>
              header.name === 'Content-Disposition' && header.value?.startsWith('attachment'),
            ),
          )
          .map(part => part.body!.attachmentId!)
          .map(attachmentId => this.gmail.users.messages.attachments.get({
            userId: 'me',
            messageId: message.id!,
            id: attachmentId,
          }).then(response => ({attachmentId, ...response.data}))) || [])
        controller.enqueue({message, attachments})
      },
    })

    return mailIdsStream
      .pipeThrough(reverseStream())
      .pipeThrough(fetchMailsStream)
      .pipeThrough(fetchAttachmentsStream)
  }

  async getLabels(): Promise<Label[]> {
    const response = await this.gmail.users.labels.list({userId: 'me'})
    return response.data.labels ?? []
  }
}

export function toGmail(auth: Auth.OAuth2Client): Gmail {
  const gmail = google.gmail({version: 'v1', auth})
  return new Gmail(gmail)
}
