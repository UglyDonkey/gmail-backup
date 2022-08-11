import {Command} from '@oclif/core'
import {generateAuthUrl} from '../../google/oauth'

export default class OAuth extends Command {
  static description = 'Setup your google account'

  async run(): Promise<void> {
    const authUrl = generateAuthUrl()
    this.log(`Auth url is ${authUrl}`)
  }
}
