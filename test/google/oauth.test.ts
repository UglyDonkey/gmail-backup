import {expect, spy} from 'chai'
import {prepareCredentials, setupOAuth, prepareOAuthWithCredentials} from '../../src/google/oauth'
import {before} from 'mocha'
import * as fs from 'node:fs'
import * as config from '../../src/config'
import {Auth} from 'googleapis'
import * as credentials from '../../src/data/credentials'

describe('oauth', () => {
  const tokens: any[] = []
  const oAuth2ClientCredentials = {credential: 'credential'}

  before(async () => {
    spy.on(config, 'getConfig', () => ({secretsPath: 'path'}))
    spy.on(fs.promises, 'readFile', async () => Buffer.from(JSON.stringify({
      installed: {
        client_id: 'id',
        client_secret: 'secret',
        redirect_uris: ['localhost'],
      },
    })))
    spy.on(Auth.OAuth2Client.prototype, 'getToken', async () => ({tokens}))
    await setupOAuth()

    spy.on(credentials, 'getCredentials', async () => [oAuth2ClientCredentials])
  })
  after(() => spy.restore())

  describe('prepareCredentials', () => {
    it('should return token', async () => {
      const credentials = await prepareCredentials('http://localhost?code=asdf')

      expect(credentials).to.equal(tokens)
    })

    it('should throw error when code param is missing', async () => {
      const error = await prepareCredentials('http://localhost?notacode=asdf').catch(error => error)

      expect(error.message).to.equal('invalid URL')
    })
  })

  describe('prepareOAuthWithCredentials', () => {
    it('should return oauth client with credentials', async () => {
      const result = await prepareOAuthWithCredentials()

      expect(result).to.have.length(1)
      expect(result[0].credentials).to.equal(oAuth2ClientCredentials)
    })
  })
})
