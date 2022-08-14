import {CliUx, Command} from '@oclif/core'
import {generateAuthUrl, prepareCredentials} from '../../google/oauth'
import {saveCredentials} from '../../data/credentials'

export default class OAuth extends Command {
  static description = 'Setup your google account'

  async run(): Promise<void> {
    const authUrl = generateAuthUrl()

    CliUx.ux.info('Use link below to setup your google account with gmail-backup')
    CliUx.ux.url(authUrl, authUrl)
    CliUx.ux.open(authUrl)

    const url: string = await CliUx.ux.prompt('Paste url from browser nav bar', {required: true})

    const credentials = await prepareCredentials(url)
    await saveCredentials(credentials)

    CliUx.ux.info('Account successfully added')
  }
}
