import {Hook} from '@oclif/core'
import {setupOAuth} from '../google/oauth'
import {setupConfig} from '../config'

const hook: Hook<'prerun'> = async function () {
  setupConfig()
  await setupOAuth()
}

export default hook
