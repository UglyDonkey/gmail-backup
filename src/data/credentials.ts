import {Auth} from 'googleapis'
import * as fs from 'node:fs/promises'

export async function saveCredentials(credentials: Auth.Credentials): Promise<void> {
  const CREDENTIALS_PATH = 'data/secrets/credentials.json'
  const allCredentials: Auth.Credentials[] = await fs.readFile(CREDENTIALS_PATH)
    .then(buffer => JSON.parse(buffer.toString()))
    .catch(error => {
      if (error.code === 'ENOENT') {
        return []
      }
      throw error
    })

  allCredentials.push(credentials)

  await fs.writeFile(CREDENTIALS_PATH, JSON.stringify(allCredentials))
}
