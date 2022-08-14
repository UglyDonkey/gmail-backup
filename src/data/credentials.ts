import {Auth} from 'googleapis'
import * as fs from 'node:fs/promises'

const CREDENTIALS_PATH = 'data/secrets/credentials.json'

export async function getCredentials(): Promise<Auth.Credentials[]> {
  try {
    const buffer = await fs.readFile(CREDENTIALS_PATH)
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

  await fs.writeFile(CREDENTIALS_PATH, JSON.stringify(allCredentials))
}
