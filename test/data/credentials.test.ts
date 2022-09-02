import mockFs from 'mock-fs'
import {before} from 'mocha'
import {expect, spy} from 'chai'
import * as config from '../../src/config'
import {getCredentials, saveCredentials} from '../../src/data/credentials'

describe('credentials', () => {
  before(() => spy.on(config, 'getConfig', () => ({secretsPath: 'secrets'})))
  after(() => spy.restore())

  beforeEach(() => mockFs())
  afterEach(() => mockFs.restore())

  describe('getCredentials', () => {
    it('should return empty array if file doesn\'t exist', async () => {
      const credentials = await getCredentials()

      expect(credentials).to.be.deep.equal([])
    })

    it('should return all credentials from file', async () => {
      mockFs({'secrets/credentials.json': '[{"access_token":"1"},{"access_token":"2"}]'})

      const credentials = await getCredentials()

      expect(credentials).to.be.deep.equal([{access_token: '1'}, {access_token: '2'}])
    })
  })

  describe('saveCredentials', () => {
    it('should append credential to file', async () => {
      mockFs({'secrets/credentials.json': '[{"access_token":"1"},{"access_token":"2"}]'})

      await saveCredentials({access_token: '3'})

      const credentials = await getCredentials()
      expect(credentials).to.be.deep.equal([{access_token: '1'}, {access_token: '2'}, {access_token: '3'}])
    })
  })
})
