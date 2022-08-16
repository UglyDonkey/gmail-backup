import fs from 'node:fs'
import {Message, MessageWithAttachments} from '../google/gmail'
import {Writable} from 'node:stream'
import {WritableStream, TransformStream} from 'node:stream/web'
import {QUEUING_STRATEGY, readLastLine} from '../common'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

function accountToDir(account: string) {
  return account.replace('@', '_at_')
}

export class SnapshotBuilder {
  private readonly now: string

  constructor() {
    this.now = dayjs.utc().format('YYYY-MM-DD_HH-mm-ss-SSS')
  }

  async getSnapshotWriter(
    account: string, onMessageSave?: (count: number) => void,
  ): Promise<WritableStream<MessageWithAttachments>> {
    const dir = `data/snapshots/${this.now}/${(accountToDir(account))}`
    await fs.promises.mkdir(dir, {recursive: true})
    const fileStream = Writable.toWeb(fs.createWriteStream(`${dir}/messages.ndjson`))
    const attachmentsFile = await fs.promises.open(`${dir}/attachments.ndjson`, 'w')
    let savedMessages = 0

    const saveAttachments = new TransformStream<MessageWithAttachments, Message>({
      transform: async ({message, attachments}, controller) => {
        if (attachments.length > 0) {
          const attachmentsNDJSON = attachments.map(attachment => `${JSON.stringify(attachment)}\n`).join('')
          await attachmentsFile.writeFile(attachmentsNDJSON)
        }
        controller.enqueue(message)
      },
      flush: () => attachmentsFile.close(),
    }, QUEUING_STRATEGY, QUEUING_STRATEGY)

    const ndjsonStream = new TransformStream<Message>({
      transform: (message, controller) => {
        const line = JSON.stringify(message)
        controller.enqueue(`${line}\n`)

        savedMessages++
        onMessageSave?.(savedMessages)
      },
    }, QUEUING_STRATEGY, QUEUING_STRATEGY)

    saveAttachments.readable
      .pipeThrough(ndjsonStream)
      .pipeTo(fileStream)
      .then()

    return saveAttachments.writable
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
