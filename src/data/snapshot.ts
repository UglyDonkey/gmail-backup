import fs from 'node:fs'
import {Message} from '../google/gmail'
import {Writable} from 'node:stream'
import {TransformStream} from 'node:stream/web'
import {QUEUING_STRATEGY} from '../common'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export class SnapshotBuilder {
  private readonly now: string

  constructor() {
    this.now = dayjs.utc().format('YYYY-MM-DD_HH-mm-ss-SSS')
  }

  async getSnapshotWriter(account: string, onMessageSave?: (count: number) => void): Promise<WritableStream<Message>> {
    const now = dayjs.utc().format('YYYY-MM-DD_HH-mm-ss-SSS')
    const dir = `data/snapshots/${now}/${account.replace('@', '_at_')}`
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

    ndjsonStream.readable.pipeTo(fileStream)
    return ndjsonStream.writable
  }
}
