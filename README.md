gmail-backup
=================

gmail backup tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/gmail-backup)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/gmail-backup/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/gmail-backup)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/gmail-backup/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g gmail-backup
$ gmail-backup COMMAND
running command...
$ gmail-backup (--version)
gmail-backup/0.1.0 linux-x64 node-v18.7.0
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

Setup your google account

```
USAGE
  $ gmail-backup oauth

DESCRIPTION
  Setup your google account
```

_See code: [dist/commands/oauth/index.ts](https://github.com/UglyDonkey/gmail-backup/blob/v0.1.0/dist/commands/oauth/index.ts)_

## `gmail-backup snapshot create`

creates new snapshot

```
USAGE
  $ gmail-backup snapshot create

DESCRIPTION
  creates new snapshot
```
<!-- commandsstop -->
