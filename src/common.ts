import {CountQueuingStrategy, TransformStream} from 'node:stream/web'
import fs from 'node:fs/promises'
import {Buffer} from 'node:buffer'

export const QUEUING_STRATEGY = new CountQueuingStrategy({highWaterMark: 4})

export function reverseStream<T>(): TransformStream<T, T> {
  const chunks: T[] = []

  return new TransformStream({
    transform: chunk => {
      chunks.push(chunk)
    },
    flush: controller => {
      chunks.reverse().forEach(chunk => controller.enqueue(chunk))
    },
  })
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

    if ((chunks.length > 0 && line) || buffer.length < length) {
      break
    }
  }

  await file.close()

  return line
}
