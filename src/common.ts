import {CountQueuingStrategy, TransformStream} from 'node:stream/web'
import fs from 'node:fs/promises'
import {BackwardLineReader} from 'file-lines-stream'

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
  const reader = new BackwardLineReader(file)
  let line = await reader.nextLine()
  if (line === '') {
    line = await reader.nextLine()
  }
  await reader.close()

  return line
}
