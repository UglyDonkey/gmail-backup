import {CountQueuingStrategy, ReadableStream, WritableStream, ReadableWritablePair} from 'node:stream/web'
import fs from 'node:fs/promises'
import {Buffer} from 'node:buffer'

export const QUEUING_STRATEGY = new CountQueuingStrategy({highWaterMark: 4})

export function reverseStream<T>(): ReadableWritablePair<T, T> {
  const chunks: T[] = []
  let sendChunks: (...args: any[]) => void
  let cancelReadable: (e: any) => void
  let abortWritable: (e: any) => void

  const sendPromise = new Promise(resolve => {
    sendChunks = resolve
  })

  const readable = new ReadableStream<T>({
    start: async controller => {
      cancelReadable = e => controller.error(e)
      await sendPromise
      if (chunks.length === 0) {
        controller.close()
      }
    },
    pull: controller => {
      controller.enqueue(chunks.pop())
      if (chunks.length === 0) {
        controller.close()
      }
    },
    cancel: reason => abortWritable(reason),
  })

  const writable = new WritableStream<T>({
    start: controller => {
      abortWritable = e => controller.error(e)
    },
    write: chunk => {
      chunks.push(chunk)
    },
    close: () => {
      sendChunks()
    },
    abort: reason => cancelReadable(reason),
  })

  return {writable, readable}
}

export async function readLastLine(path: string): Promise<string> {
  const file = await fs.open(path)
  const stats = await file.stat()
  let position = stats.size
  const length = 1024

  let line = ''
  while (position > -length) {
    position -= length
    const {buffer} = await file.read(position < 0 ?
      {buffer: Buffer.alloc(length + position), position: 0} :
      {buffer: Buffer.alloc(length), position},
    )
    let chunks = buffer.toString().split('\n')

    if (line) {
      line = chunks.pop() + line
    } else {
      chunks = chunks.filter(line => line)
      line = chunks.pop() ?? ''
    }

    if (chunks.length > 0 && line) {
      break
    }
  }

  await file.close()

  return line
}
