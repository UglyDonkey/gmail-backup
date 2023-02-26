import {ux, Command} from '@oclif/core'
import {generateAuthUrl, prepareCredentials} from '../../google/oauth'
import {saveCredentials} from '../../data/credentials'

export default class OAuth extends Command {
  static description = 'Setup your google account with oauth. It supports multiple accounts.'

  async run(): Promise<void> {
    const authUrl = generateAuthUrl()

    ux.info('Use link below to setup your google account with gmail-backup')
    ux.url(authUrl, authUrl)

    const url: string = await ux.prompt('Paste url from browser nav bar', {required: true})

    const credentials = await prepareCredentials(url)
    await saveCredentials(credentials)

    ux.info('Account successfully added')
  }
}
