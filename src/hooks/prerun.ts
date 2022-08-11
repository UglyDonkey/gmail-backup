import {Hook} from '@oclif/core'
import {setupOAuth} from '../google/oauth'

const hook: Hook<'prerun'> = async function () {
  await setupOAuth()
}

export default hook
