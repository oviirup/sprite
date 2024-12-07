# Sprite

![publish](https://github.com/oviirup/sprite/workflows/Publish/badge.svg)
[![version](https://img.shields.io/npm/v/sprite)](https://www.npmjs.com/package/sprite)

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

Create a entry file with `.yaml` <sup><a href='#sprite-record-config'>REF</a></sup> as follows ...

```yaml
# icons.yaml
name: lucide-icons
output: icons.sprite.svg
icons:
  - name: arrow-up
    content: <path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>
    tags: [device, notification, time, clock]
    attributes:
      viewBox: 0 0 24 24
      fill: none
      stroke: currentcolor
      stroke-linecap: round
      stroke-linejoin: round
      stroke-width: 2
```

And you are all ready to go. Now while you are building you can reference the file.

You can also set the entry points in `package.json` <sup><a href='#sprite-base-config'>REF</a></sup> as follows...

```json
// package.json
{
  "sprite": {
    "cwd": "src",
    "entries": ["icons.yaml"]
  }
}
```

Learn more about [configuration](#configuration).

## Usage

If you installed it use ...

```
npm sprite build icons.yaml
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
- icons: `Icon[]` \*\
  Icon sets configuration

### Icon config

- name: `String` \*\
  Name of the icon, (should be in lowercase)
- content: `String` \*\
  Inner content of the svg icon
- attributes: `Record<string, string>`\
  SVG attributes
- tags: `String[]`\
  Tags for the icon for search

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