import {homedir} from 'node:os'

export interface Config {
  secretsPath: string;
  snapshotsPath: string;
}

const defaultConfig: Config = {
  secretsPath: `${homedir()}/.gmail-backup/secrets`,
  snapshotsPath: `${homedir()}/.gmail-backup/snapshots`,
}

const defaultDevConfig: Partial<Config> = {
  secretsPath: 'data/secrets',
  snapshotsPath: 'data/snapshots',
}

const configFromEnvs: Partial<Config> = {
  secretsPath: process.env.SECRETS_PATH,
  snapshotsPath: process.env.SNAPSHOTS_PATH,
}

let config: Config

export function setupConfig(): void {
  config = Object.fromEntries([
    defaultConfig,
    ['development', 'test'].includes(`${process.env.NODE_ENV}`.toLowerCase()) ? defaultDevConfig : {},
    configFromEnvs,
  ]
    .flatMap(Object.entries)
    .filter(([, value]) => value !== undefined)) as Config
}

export function getConfig(): Config {
  return config
}
