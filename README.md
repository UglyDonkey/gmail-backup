gmail-backup
=================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gmail-backup.svg)](https://npmjs.org/package/gmail-backup)
[![Docker Image Version (latest semver)](https://img.shields.io/docker/v/uglydonkey/gmail-backup?label=docker%20image)](https://hub.docker.com/repository/docker/uglydonkey/gmail-backup)
[![License](https://img.shields.io/npm/l/gmail-backup.svg)](https://github.com/oclif/gmail-backup/blob/main/package.json)

Tool for backing up all your gmail messages

It's available as helm chart with cronjob ready to use as truenas scale app in [ugly-charts](https://github.com/UglyDonkey/ugly-charts) catalog



<!-- toc -->
* [Configuration](#configuration)
* [Setup oauth credentials](#setup-oauth-credentials)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Configuration

| Env variable     | Description                         | Default value               |
|------------------|-------------------------------------|-----------------------------|
| `SECRETS_PATH`   | Path to store sensitive credentials | `~/.gmail-backup/secrets`   |
| `SNAPSHOTS_PATH` | Path to store all messages          | `~/.gmail-backup/snapshots` |

# Setup oauth credentials
1. Create project and OAuth 2.0 Client ID for Desktop client at https://console.cloud.google.com/apis/credentials. Use `download JSON` button, then save file in secrets directory as `client_secret.json`
2. Enable gmail api at https://console.cloud.google.com/apis/library/gmail.googleapis.com
3. Use `gmail-backup oauth` to connect gmail-backup with your google account

# Usage
<!-- usage -->
```sh-session
$ npm install -g gmail-backup
$ gmail-backup COMMAND
running command...
$ gmail-backup (--version)
gmail-backup/0.2.2 linux-x64 node-v18.14.1
$ gmail-backup --help [COMMAND]
USAGE
  $ gmail-backup COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gmail-backup help [COMMAND]`](#gmail-backup-help-command)
* [`gmail-backup oauth`](#gmail-backup-oauth)
* [`gmail-backup snapshot create`](#gmail-backup-snapshot-create)

## `gmail-backup help [COMMAND]`

Display help for gmail-backup.

```
USAGE
  $ gmail-backup help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for gmail-backup.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `gmail-backup oauth`

Setup your google account with oauth. It supports multiple accounts.

```
USAGE
  $ gmail-backup oauth

DESCRIPTION
  Setup your google account with oauth. It supports multiple accounts.
```

_See code: [src/commands/oauth/index.ts](https://github.com/UglyDonkey/gmail-backup/blob/v0.2.2/src/commands/oauth/index.ts)_

## `gmail-backup snapshot create`

Creates new incremental snapshot in configured directory. It's meant to be run periodically (for example with cron).

```
USAGE
  $ gmail-backup snapshot create

DESCRIPTION
  Creates new incremental snapshot in configured directory. It's meant to be run periodically (for example with cron).
```
<!-- commandsstop -->
