import mockFs from 'mock-fs'
import {before} from 'mocha'
import {expect, spy} from 'chai'
import * as config from '../../src/config'
import {SnapshotBuilder, findLastSavedMessage} from '../../src/data/snapshot'
import fs from 'node:fs/promises'

describe('snapshot', () => {
  const account = 'test@gmail.com'
  const accountDir = 'test_at_gmail.com'
  const snapshots = 'snapshots'

  before(() => spy.on(config, 'getConfig', () => ({snapshotsPath: snapshots})))
  after(() => spy.restore())

  beforeEach(() => mockFs())
  afterEach(() => mockFs.restore())

  describe('SnapshotBuilder', () => {
    describe('getSnapshotWriter', () => {
      const snapshotBuilder = new SnapshotBuilder()
      const expectedSnapshotDir = `${snapshots}/${(snapshotBuilder as any).now}/${accountDir}`

      it('should write all messages to file', async () => {
        const writableStream = await snapshotBuilder.getSnapshotWriter(account)
        const writer = writableStream.getWriter()
        await writer.write({message: {id: '1'}, attachments: []})
        await writer.write({message: {id: '2'}, attachments: []})
        await writer.close()

        const fileContent = await fs.readFile(`${expectedSnapshotDir}/messages.ndjson`)
        const writtenMessages = fileContent.toString().split('\n').filter(line => line).map(line => JSON.parse(line))

        expect(writtenMessages).to.deep.equal([{id: '1'}, {id: '2'}])
      })

      it('should write attachments', async () => {
        const writableStream = await snapshotBuilder.getSnapshotWriter(account)
        const writer = writableStream.getWriter()
        await writer.write({message: {id: '1'}, attachments: [{attachmentId: '3'}, {attachmentId: '4'}]})
        await writer.write({message: {id: '2'}, attachments: [{attachmentId: '5'}]})
        await writer.close()

        const fileContent = await fs.readFile(`${expectedSnapshotDir}/attachments.ndjson`)
        const writtenMessages = fileContent.toString().split('\n').filter(line => line).map(line => JSON.parse(line))

        expect(writtenMessages).to.deep.equal([{attachmentId: '3'}, {attachmentId: '4'}, {attachmentId: '5'}])
      })
    })
  })

  describe('findLastSavedMessage', () => {
    beforeEach(() => mockFs())
    afterEach(() => mockFs.restore())

    it('should not return message if there is no snapshots', async () => {
      const message = await findLastSavedMessage(account)

      expect(message).to.be.equal(undefined)
    })

    it('should return last message from recent snapshot', async () => {
      mockFs({
        [snapshots]: {
          2020: {[accountDir]: {'messages.ndjson': '{"id":1}\n{"id":2}'}},
          2021: {[accountDir]: {'messages.ndjson': '{"id":3}\n{"id":4}'}},
        },
      })

      const message = await findLastSavedMessage(account)

      expect(message).to.be.deep.equal({id: 4})
    })
  })
})
