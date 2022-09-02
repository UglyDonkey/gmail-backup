import mockFs from 'mock-fs'
import {reverseStream, readLastLine} from '../src/common'
import {expect, spy} from 'chai'
import {before} from 'mocha'

describe('common', () => {
  describe('reverseStream', () => {
    it('should return elements in reverse order', async () => {
      const elements = [1, 2, 3, 4, 5]
      const source = new ReadableStream<number>({
        start: controller => {
          elements.forEach(element => controller.enqueue(element))
          controller.close()
        },
      })
      const output: number[] = []
      const sink = new WritableStream<number>({
        write: element => {
          output.push(element)
        },
      })

      await source.pipeThrough(reverseStream()).pipeTo(sink)

      expect(output).to.deep.equal([5, 4, 3, 2, 1])
    })

    it('should handle error on writable side', async () => {
      const error = new Error('TestError')
      const source = new ReadableStream<number>({
        pull: controller => {
          controller.error(error)
        },
      })
      const writeSpy = spy()
      const abortSpy = spy()

      const sink = new WritableStream<number>({write: writeSpy, abort: abortSpy})

      const catchSpy = spy()

      await Promise.race([
        source.pipeThrough(reverseStream()).pipeTo(sink).catch(catchSpy),
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('timeout after 100 ms')), 100)
        }),
      ])

      expect(writeSpy).to.not.have.been.called()
      expect(abortSpy).to.have.been.called.with(error)

      expect(catchSpy).to.have.been.called.with(error)
    })

    it('should handle error on readable side', async () => {
      const pullSpy = spy(async (controller: ReadableStreamController<number>) => {
        await new Promise(resolve => {
          setTimeout(resolve, 100)
        })
        controller.enqueue(1)
      })
      const cancelSpy = spy()
      const source = new ReadableStream<number>({pull: pullSpy, cancel: cancelSpy})

      const error = new Error('TestError')
      const sink = new WritableStream<number>({
        start: controller => {
          controller.error(error)
        },
      })

      const catchSpy = spy()

      await Promise.race([
        source.pipeThrough(reverseStream()).pipeTo(sink).catch(catchSpy),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('timeout after 100 ms'))
          },
          100)
        }),
      ])

      expect(pullSpy).to.have.been.called.exactly(1)
      expect(cancelSpy).to.have.been.called.with(error)
      expect(catchSpy).to.have.been.called.with(error)
    })

    it('should return 0 elements if 0 was provided', async () => {
      const source = new ReadableStream<number>({
        start: controller => controller.close(),
      })
      const output: number[] = []
      const sink = new WritableStream<number>({
        write: element => {
          output.push(element)
        },
      })

      await source.pipeThrough(reverseStream()).pipeTo(sink)

      expect(output).to.have.length(0)
    })
  })

  describe('readLastLine', () => {
    before(() => mockFs())
    after(() => mockFs.restore())

    const counts = [1, 100, 1000]
    const widths = [1, 100, 5000]
    const newlineAtEndOfFile = [true, false]
    const fileName = 'file.txt'

    const testParams = counts.flatMap(count => widths.flatMap(width => newlineAtEndOfFile.map(newlineAtEndOfFile =>
      ({count, width, newlineAtEndOfFile}))),
    )

    const mockFile = (params: {count: number, width: number, newlineAtEndOfFile: boolean}) => {
      const lines = Array
        .from({length: params.count}, () => Array
          .from({length: params.width}, () => Math.floor(Math.random() * 34).toString(34))
          .join(''),
        )
      let content = lines
        .join('\n')

      if (params.newlineAtEndOfFile) {
        content += '\n'
      }

      mockFs({[fileName]: content})
      return lines[lines.length - 1]
    }
    testParams.forEach(params => it(`should return last line ${JSON.stringify(params)}`, async () => {
      const lastLine = mockFile(params)
      const result = await readLastLine(fileName)
      expect(result).to.equal(lastLine)
    }))

    it('should return empty string when file is empty', async () => {
      mockFs({[fileName]: ''})
      const result = await readLastLine(fileName)
      expect(result).to.equal('')
    })
  })
})
