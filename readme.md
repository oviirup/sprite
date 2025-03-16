# Sprite ![](https://img.shields.io/badge/WIP-gold)

![publish](https://github.com/oviirup/sprite/workflows/CI/badge.svg)
[![version](https://img.shields.io/npm/v/@oviirup/sprite)](https://www.npmjs.com/package/@oviirup/sprite)

Simple tool to create SVG sprite sheet from SVG icons

> [!NOTE]
> This project is still in active development.

## Getting started

### Installation

The installation process is pretty much the same as another library, whether you use `npm`, `pnpm`, `yarn`, or `bun`.

```bash
npm i @oviirup/sprite -D
```

It will install the package with binary `sprite`

### Setup a sprite project

You can initiate a simple project with `init` command,

```bash
npm sprite init
```

You can also manually create a entry file with `.yaml` or `.json` <sup><a href='#sprite-record-config'>REF</a></sup> as follows ...

```json
{
  "$schema": "https://unpkg.com/@oviirup/sprite/schema.json",
  "name": "lucide-icons",
  "output": "icons.sprite.svg",
  "icons": {
    "home": {
      "content": "<path d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'/><path d='M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/>",
      "attributes": {
        "viewBox": "0 0 24 24",
        "fill": "none",
        "stroke": "currentcolor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2"
      }
    }
  }
}
```

If you want you could also initiate a project with a `.yaml` file with `--yaml` flag.

When using the json entry you can use the json schema <https://unpkg.com/@oviirup/sprite/schema.json> as follows

```json
// icons.json
{
  "$schema": "https://unpkg.com/@oviirup/sprite/schema.json",
  "name": "icon"
}
```

And you are all ready to go. Now while you are building you can reference the file.

You can also set the entry points in `package.json` <sup><a href='#sprite-base-config'>REF</a></sup> as follows...

```json
{
  "sprite": ["icons.sprite.yaml"]
}
```

Learn more about [configuration](#configuration).

## Usage

If you installed it use ...

```
npm sprite build icons.sprite.yaml
```

The CLI can pickup configuration from `package.json`, so you don't need to use any entry point in the CLI. Any entry point defined in the CLI will overwrite the config.

```
npm sprite build
```

Or, you can directly use the CLI without installing with `npx`

```bash
npx @oviirup/sprite build icons.yaml
```

## Configuration

You can define the root configuration in `package.json` with an object of `sprite`.

### Sprite base config

- entries: `String | String[]` \*\
  Entries for sprite record (path or glob pattern, relative to cwd)
- watch: `Boolean`\
  Enable watch mode
- cwd: `String`\
  Working directory (default: process.cwd())

### Sprite record config

- name: `String` \*\
  Name of the sprite project
- output: `String` \*\
  Output file without extension, relative to cwd
- prefix: `String`\
  Prefix for icon names, with no empty space
- icons: `Record<string,Icon>` \*\
  Icon sets configuration

### Icon config

- content: `String` \*\
  Inner content of the svg icon
- attributes: `Record<string,string>`\
  SVG attributes
- tags: `String[]`\
  Tags for the icon for search

### TypeSafe Icon names

The icon names can be typesafe with a simple trick of typescript.

```ts
import type Sprite from './icons.sprite.json';

type IconNames = keyof (typeof IconsSprite)['icons'];
```

> NOTE: This can only be achieved using `.json` entry.

## Contributing & Development

You are welcome to contribute to the project. Please follow the [contributing guidelines](/.github/contributing.md) before making any contribution.

- **Fork & clone to local machine**\
  Fork the repo from GitHub by clicking the fork button at the top-right and clone it...

  ```bash
  git clone https://github.com/username/sprite.git
  ```

- **Create a new branch**\
  Please make sure you are not on the **main** branch before making any changes.

  ```bash
  git checkout -b my-new-branch
  ```

- **Install dependencies**\
  This project uses [bun.js](https://bun.sh/), although any other package manager can be used as well.
  ```bash
  bun install
  ```
