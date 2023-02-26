import {CountQueuingStrategy, TransformStream} from 'node:stream/web'
import {readLastLines} from 'file-lines-stream'

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
  const [line] = await readLastLines(path, 1, {ignoreEmptyLines: true})
  return line ?? ''
}
