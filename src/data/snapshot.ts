import fs from 'node:fs'
import {Label, Message, MessageWithAttachments} from '../google/gmail'
import {Writable} from 'node:stream'
import {TransformStream, WritableStream} from 'node:stream/web'
import {QUEUING_STRATEGY, readLastLine} from '../common'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {getConfig} from '../config'

dayjs.extend(utc)

function accountToDir(account: string) {
  return account.replace('@', '_at_')
}

interface SnapshotWriter {
  messageWithAttachments: WritableStream<MessageWithAttachments>;
  writeLabels: (labels: Label[]) => Promise<void>
}

export class SnapshotBuilder {
  private readonly now: string
  constructor() {
    this.now = dayjs.utc().format('YYYY-MM-DD_HH-mm-ss-SSS')
  }

  async getSnapshotWriter(
    account: string, onMessageSave?: (count: number) => void,
  ): Promise<SnapshotWriter> {
    const accountDir = accountToDir(account)
    const dir = getSnapshotPath(this.now, accountDir)
    await fs.promises.mkdir(dir, {recursive: true})

    const messageWithAttachments = await this.prepareMessageWithAttachmentsWritable(accountDir, onMessageSave)

    const writeLabels = async (labels: Label[]) => {
      await fs.promises.writeFile(
        getLabelsPath(this.now, accountDir),
        labels.map(label => JSON.stringify(label)).join('\n'),
      )
    }

    return {messageWithAttachments, writeLabels}
  }

  private async prepareMessageWithAttachmentsWritable(accountDir: string, onMessageSave?: (count: number) => void) {
    const fileStream = Writable.toWeb(fs.createWriteStream(getMessagesPath(this.now, accountDir)))
    const attachmentsFile = await fs.promises.open(getAttachmentsPath(this.now, accountDir), 'w')
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
  const snapshots = await fs.promises.readdir(getConfig().snapshotsPath).catch(error => {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  })

  for (const snapshot of snapshots.sort().reverse()) {
    try {
      const lastLine = await readLastLine(getMessagesPath(snapshot, account))
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

function getSnapshotPath(snapshot: string, account: string) {
  return `${getConfig().snapshotsPath}/${snapshot}/${accountToDir(account)}`
}

function getMessagesPath(snapshot: string, account: string) {
  return `${getSnapshotPath(snapshot, account)}/messages.ndjson`
}

function getAttachmentsPath(snapshot: string, account: string) {
  return `${getSnapshotPath(snapshot, account)}/attachments.ndjson`
}

function getLabelsPath(snapshot: string, account: string) {
  return `${getSnapshotPath(snapshot, account)}/labels.ndjson`
}
