import {Hook} from '@oclif/core'
import {setupOAuth} from '../google/oauth'
import {setupConfig} from '../config'

const hook: Hook<'prerun'> = async function () {
  try {
    setupConfig()
    await setupOAuth()
  } catch (error: any) {
    console.error('Error in prerun hook', error)
    // eslint-disable-next-line no-process-exit,unicorn/no-process-exit
    process.exit(1)
  }
}

export default hook
