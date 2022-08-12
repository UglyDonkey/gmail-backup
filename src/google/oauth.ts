import {Auth} from 'googleapis'
import * as fs from 'node:fs/promises'

let oAuth2Client: Auth.OAuth2Client

interface ClientConfig {
  installed: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
  }
}

export async function setupOAuth(): Promise<void> {
  const buffer = await fs.readFile('data/secrets/client_secret.json')
  const clientConfig: ClientConfig = JSON.parse(buffer.toString())
  oAuth2Client = new Auth.OAuth2Client({
    clientId: clientConfig.installed.client_id,
    clientSecret: clientConfig.installed.client_secret,
    redirectUri: clientConfig.installed.redirect_uris[0],
  })
}

const GENERATE_URL_OPTS = {access_type: 'offline', scope: ['https://www.googleapis.com/auth/gmail.readonly']}

export function generateAuthUrl(): string {
  return oAuth2Client.generateAuthUrl(GENERATE_URL_OPTS)
}

export async function getCredentials(url: string): Promise<Auth.Credentials> {
  const urlSearchParams = new URLSearchParams(url.split('?')[1])
  const code = urlSearchParams.get('code')
  if (!code) {
    throw new Error('invalid URL')
  }
  const response = await oAuth2Client.getToken(code)
  return response.tokens
}
