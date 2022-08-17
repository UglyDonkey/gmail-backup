import {Auth} from 'googleapis'
import * as fs from 'node:fs/promises'
import {getConfig} from '../config'

function getCredentialsPath() {
  return `${getConfig().secretsPath}/credentials.json`
}

export async function getCredentials(): Promise<Auth.Credentials[]> {
  try {
    const buffer = await fs.readFile(getCredentialsPath())
    return JSON.parse(buffer.toString())
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

export async function saveCredentials(credentials: Auth.Credentials): Promise<void> {
  const allCredentials = await getCredentials()

  allCredentials.push(credentials)

  await fs.writeFile(getCredentialsPath(), JSON.stringify(allCredentials))
}
