/* eslint-disable unicorn/consistent-function-scoping */
import {Gmail, MessageWithAttachments, toGmail} from '../../src/google/gmail'
import {expect, spy} from 'chai'
import {Auth, gmail_v1} from 'googleapis'
import {WritableStream} from 'node:stream/web'

describe('gmail', () => {
  afterEach(() => spy.restore())

  describe('Gmail', () => {
    describe('getProfile', () => {
      it('should return profile', async () => {
        const email = 'example@gmail.com'
        const gmail = new Gmail({users: {getProfile: async () => ({data: {emailAddress: email}})}} as any)

        const profile = await gmail.getProfile()

        expect(profile.emailAddress).to.equal(email)
      })
    })

    describe('getEmailReader', () => {
      function prepareGmailApiStub(params: {
        list?: { messages: { id: string }[], nextPageToken?: string }[]
        messages?: {
          id: string, snippet: string,
          payload?: {
            parts: {headers: [{name: 'Content-Disposition', value: 'attachment'}], body: {attachmentId: string}}[]
          }
        }[]
        attachments?: { attachmentId: string, data: string }[]
      }): gmail_v1.Gmail {
        return  {
          users: {
            messages: {
              list: spy(async ({pageToken}: { pageToken?: string }) => ({data: params.list?.[Number(pageToken ?? 0)]})),
              get: spy(async ({id}: {id: string}) => ({data: params.messages?.find(message => message.id === id)})),
              attachments: {
                get: spy(async ({id}: {id: string}) =>
                  ({data: params.attachments?.find(attachment => attachment.attachmentId === id)}),
                ),
              },
            },
          },
        } as any
      }

      async function executeTest(gmail: Gmail, lastMessageId?: string): Promise<MessageWithAttachments[]> {
        const result: MessageWithAttachments[] = []
        const sink = new WritableStream<MessageWithAttachments>({write: message => {
          result.push(message)
        }})

        const messagesStream = gmail.getEmailReader(undefined, lastMessageId)
        await messagesStream.pipeTo(sink)

        return result
      }

      it('should return empty stream when no messages from api', async () => {
        const gmailApiStub = prepareGmailApiStub({
          list: [{messages: []}],
        })
        const gmail = new Gmail(gmailApiStub)

        const result = await executeTest(gmail)

        expect(result).to.have.length(0)
        expect(gmailApiStub.users.messages.list).to.be.called.exactly(1)
        expect(gmailApiStub.users.messages.get).not.to.be.called()
        expect(gmailApiStub.users.messages.attachments.get).not.to.be.called()
      })

      it('should return readable stream with messages in reverse order', async () => {
        const list = [{messages: [{id: '1'}, {id: '2'}]}]
        const messages = [{id: '1', snippet: 'snippet1'}, {id: '2', snippet: 'snippet2'}]
        const gmailApiStub = prepareGmailApiStub({list, messages})
        const gmail = new Gmail(gmailApiStub)

        const result = await executeTest(gmail)

        expect(result).to.deep.equal([
          {message: messages[1], attachments: []},
          {message: messages[0], attachments: []},
        ])
      })

      it('should return readable stream with message with attachment', async () => {
        const list = [{messages: [{id: '1'}]}]
        const message = {
          id: '1',
          snippet: 'snippet1',
          payload: {
            parts: [{headers: [{name: 'Content-Disposition', value: 'attachment'}], body: {attachmentId: '3'}}],
          },
        } as any
        const attachment = {attachmentId: '3', data: 'body'}
        const gmailApiStub = prepareGmailApiStub({list, messages: [message], attachments: [attachment]})
        const gmail = new Gmail(gmailApiStub)

        const result = await executeTest(gmail)

        expect(result).to.deep.equal([
          {message, attachments: [attachment]},
        ])
      })

      it('should fetch all list pages', async () => {
        const list = [{messages: [{id: '1'}], nextPageToken: '1'}, {messages: [{id: '2'}]}]
        const messages = [{id: '1', snippet: 'snippet1'}, {id: '2', snippet: 'snippet2'}]
        const gmailApiStub = prepareGmailApiStub({list, messages})
        const gmail = new Gmail(gmailApiStub)

        const result = await executeTest(gmail)

        expect(result).to.deep.equal([
          {message: messages[1], attachments: []},
          {message: messages[0], attachments: []},
        ])
      })

      it('should fetch only new messages list pages', async () => {
        const list = [{messages: [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}], nextPageToken: '1'}]
        const messages = [{id: '1', snippet: 'snippet1'}, {id: '2', snippet: 'snippet2'}]
        const lastMessageId = '3'
        const gmailApiStub = prepareGmailApiStub({list, messages})
        const gmail = new Gmail(gmailApiStub)

        const result = await executeTest(gmail, lastMessageId)

        expect(result).to.deep.equal([
          {message: messages[1], attachments: []},
          {message: messages[0], attachments: []},
        ])
      })
    })

    describe('getLabels', async () => {
      it('should return labels', async () => {
        const labels = [{id: '1'}, {id: '2'}]
        const gmail = new Gmail({users: {labels: {list: async () => ({data: {labels}})}}} as any)

        const response = await gmail.getLabels()

        expect(response).to.deep.equal(labels)
      })
    })
  })

  describe('toGmail', () => {
    it('should create Gmail object with proper gmail api client', () => {
      const auth = {credentials: {access_token: 'access_token'}} as Auth.OAuth2Client

      const gmail: any = toGmail(auth)

      expect(gmail.gmail.context._options.auth).to.equal(auth)
    })
  })
})
