oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

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
* [`gmail-backup plugins`](#gmail-backup-plugins)
* [`gmail-backup plugins:install PLUGIN...`](#gmail-backup-pluginsinstall-plugin)
* [`gmail-backup plugins:inspect PLUGIN...`](#gmail-backup-pluginsinspect-plugin)
* [`gmail-backup plugins:install PLUGIN...`](#gmail-backup-pluginsinstall-plugin-1)
* [`gmail-backup plugins:link PLUGIN`](#gmail-backup-pluginslink-plugin)
* [`gmail-backup plugins:uninstall PLUGIN...`](#gmail-backup-pluginsuninstall-plugin)
* [`gmail-backup plugins:uninstall PLUGIN...`](#gmail-backup-pluginsuninstall-plugin-1)
* [`gmail-backup plugins:uninstall PLUGIN...`](#gmail-backup-pluginsuninstall-plugin-2)
* [`gmail-backup plugins update`](#gmail-backup-plugins-update)

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `gmail-backup plugins`

List installed plugins.

```
USAGE
  $ gmail-backup plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ gmail-backup plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `gmail-backup plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ gmail-backup plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ gmail-backup plugins add

EXAMPLES
  $ gmail-backup plugins:install myplugin 

  $ gmail-backup plugins:install https://github.com/someuser/someplugin

  $ gmail-backup plugins:install someuser/someplugin
```

## `gmail-backup plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ gmail-backup plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ gmail-backup plugins:inspect myplugin
```

## `gmail-backup plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ gmail-backup plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ gmail-backup plugins add

EXAMPLES
  $ gmail-backup plugins:install myplugin 

  $ gmail-backup plugins:install https://github.com/someuser/someplugin

  $ gmail-backup plugins:install someuser/someplugin
```

## `gmail-backup plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ gmail-backup plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ gmail-backup plugins:link myplugin
```

## `gmail-backup plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ gmail-backup plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gmail-backup plugins unlink
  $ gmail-backup plugins remove
```

## `gmail-backup plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ gmail-backup plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gmail-backup plugins unlink
  $ gmail-backup plugins remove
```

## `gmail-backup plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ gmail-backup plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gmail-backup plugins unlink
  $ gmail-backup plugins remove
```

## `gmail-backup plugins update`

Update installed plugins.

```
USAGE
  $ gmail-backup plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
