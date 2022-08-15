import fs from 'node:fs'
import {Attachment, Message} from '../google/gmail'
import {Writable} from 'node:stream'
import {WritableStream, TransformStream} from 'node:stream/web'
import {QUEUING_STRATEGY, readLastLine} from '../common'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

type MessageWritable = { messages: WritableStream<Message>, attachments: WritableStream<Attachment> }

function accountToDir(account: string) {
  return account.replace('@', '_at_')
}

export class SnapshotBuilder {
  private readonly now: string

  constructor() {
    this.now = dayjs.utc().format('YYYY-MM-DD_HH-mm-ss-SSS')
  }

  async getSnapshotWriter(account: string, onMessageSave?: (count: number) => void): Promise<MessageWritable> {
    const dir = `data/snapshots/${this.now}/${(accountToDir(account))}`
    await fs.promises.mkdir(dir, {recursive: true})
    const fileStream = Writable.toWeb(fs.createWriteStream(`${dir}/messages.ndjson`))
    let savedMessages = 0

    const ndjsonStream = new TransformStream<Message>({
      transform: (message, controller) => {
        const line = JSON.stringify(message)
        controller.enqueue(`${line}\n`)

        savedMessages++
        onMessageSave?.(savedMessages)
      },
    }, QUEUING_STRATEGY, QUEUING_STRATEGY)

    const attachmentStream = new WritableStream<Attachment>({
      start: () => fs.promises.mkdir(`${dir}/attachments`, {recursive: true}),
      write: attachment =>
        fs.promises.writeFile(`${dir}/attachments/${attachment.attachmentId}.json`, JSON.stringify(attachment)),
    }, QUEUING_STRATEGY)

    ndjsonStream.readable.pipeTo(fileStream)
    return {messages: ndjsonStream.writable, attachments: attachmentStream}
  }
}

export async function findLastSavedMessage(account: string): Promise<Message | undefined> {
  const snapshots = await fs.promises.readdir('data/snapshots').catch(error => {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  })

  for (const snapshot of snapshots.sort().reverse()) {
    try {
      const lastLine = await readLastLine(`data/snapshots/${snapshot}/${accountToDir(account)}/messages.ndjson`)
      if (lastLine) {
        return JSON.parse(lastLine)
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  }

  return undefined
}
