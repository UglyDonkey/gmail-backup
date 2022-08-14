import {CliUx, Command} from '@oclif/core'
import {prepareOAuthWithCredentials} from '../../google/oauth'
import {toGmail} from '../../google/gmail'
import {SnapshotBuilder} from '../../data/snapshot'

export default class CreateSnapshot extends Command {
  static description = 'creates new snapshot '

  async run(): Promise<void> {
    const gmails = (await prepareOAuthWithCredentials()).map(toGmail)
    const snapshot = new SnapshotBuilder()
    for (const gmail of gmails) {
      const progress = CliUx.ux.progress({noTTYOutput: true})

      const profile = await gmail.getProfile()
      if (!profile.emailAddress) {
        throw new Error('emailAddress must be defined')
      }
      CliUx.ux.info(`creating snapshot for ${profile.emailAddress}`)
      progress.start()

      const emailReader = gmail.getEmailReader(total => progress.setTotal(total))

      const snapshotWriter = await snapshot.getSnapshotWriter(profile.emailAddress, count => progress.update(count))

      await emailReader.pipeTo(snapshotWriter)

      progress.stop()
    }
    CliUx.ux.info('snapshot created')
  }
}
