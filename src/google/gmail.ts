import {Auth, gmail_v1, google} from 'googleapis'
import {ReadableStream, TransformStream} from 'node:stream/web'
import {QUEUING_STRATEGY, reverseStream} from '../common'

export type Message = gmail_v1.Schema$Message
export type Profile = gmail_v1.Schema$Profile
export type Attachment = gmail_v1.Schema$MessagePartBody

const LIST_PARAMS = {userId: 'me', maxResults: 500}

type MessageReadable = { messages: ReadableStream<Message>, attachments: ReadableStream<Attachment> }

export class Gmail {
  constructor(private gmail: gmail_v1.Gmail) {}

  async getProfile(): Promise<Profile> {
    const {data: profile} = await this.gmail.users.getProfile({userId: 'me'})
    return profile
  }

  getEmailReader(setTotal?: (total: number) => void, lastMessageId?: string): MessageReadable {
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

    const mailStream = new TransformStream<string, Message>({
      transform: async (messageId, controller) => {
        const {data: message} = await this.gmail.users.messages.get({userId: 'me', id: messageId})
        controller.enqueue(message)
      },
    }, QUEUING_STRATEGY, QUEUING_STRATEGY)

    const extractAttachmentsStream = new TransformStream<Message, { messageId: string, attachmentId: string }>({
      transform: (message, controller) => {
        message.payload?.parts
          ?.filter(part =>
            part.headers?.some(header => header.name === 'Content-Disposition' && header.value === 'attachment'),
          )
          .map(part => part.body!.attachmentId!)
          .forEach(attachmentId => controller.enqueue({messageId: message.id!, attachmentId}))
      },
    }, QUEUING_STRATEGY, QUEUING_STRATEGY)

    const fetchAttachmentStream = new TransformStream<{ messageId: string, attachmentId: string }, Attachment>({
      transform: async ({messageId, attachmentId}, controller) => {
        const {data: attachment} = await this.gmail.users.messages.attachments.get({
          userId: 'me',
          messageId,
          id: attachmentId,
        })
        attachment.attachmentId = attachmentId
        controller.enqueue(attachment)
      },
    })

    const mailStreams = mailIdsStream.pipeThrough(reverseStream()).pipeThrough(mailStream).tee()
    const attachments = mailStreams[0].pipeThrough(extractAttachmentsStream).pipeThrough(fetchAttachmentStream)

    return {messages: mailStreams[1], attachments}
  }
}

export function toGmail(auth: Auth.OAuth2Client): Gmail {
  const gmail = google.gmail({version: 'v1', auth})
  return new Gmail(gmail)
}
