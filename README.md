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
gmail-backup/0.0.0 linux-x64 node-v16.13.0
$ gmail-backup --help [COMMAND]
USAGE
  $ gmail-backup COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gmail-backup hello PERSON`](#gmail-backup-hello-person)
* [`gmail-backup hello world`](#gmail-backup-hello-world)
* [`gmail-backup help [COMMAND]`](#gmail-backup-help-command)

## `gmail-backup hello PERSON`

Say hello

```
USAGE
  $ gmail-backup hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/UglyDonkey/gmail-backup/blob/v0.0.0/dist/commands/hello/index.ts)_

## `gmail-backup hello world`

Say hello world

```
USAGE
  $ gmail-backup hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

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
<!-- commandsstop -->
