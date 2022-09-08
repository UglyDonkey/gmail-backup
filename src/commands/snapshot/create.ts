import {CliUx, Command} from '@oclif/core'
import {prepareOAuthWithCredentials} from '../../google/oauth'
import {toGmail} from '../../google/gmail'
import {findLastSavedMessage, SnapshotBuilder} from '../../data/snapshot'

export default class CreateSnapshot extends Command {
  static description =
    'Creates new incremental snapshot in configured directory. ' +
    'It\'s meant to be run periodically (for example with cron).'

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

      const snapshotWriter = await snapshot.getSnapshotWriter(profile.emailAddress, count => progress.update(count))

      const labels = await gmail.getLabels()
      await snapshotWriter.writeLabels(labels)

      progress.start()

      const lastSavedMessage = await findLastSavedMessage(profile.emailAddress)
      const emailReader = gmail.getEmailReader(total => progress.setTotal(total), lastSavedMessage?.id ?? undefined)

      await emailReader.pipeTo(snapshotWriter.messageWithAttachments)

      progress.stop()
    }
    CliUx.ux.info('snapshot created')
  }
}
