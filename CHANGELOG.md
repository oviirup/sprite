# @oviirup/sprite

## 0.1.13

### Patch Changes

- [#22](https://github.com/oviirup/sprite/pull/22) [`300deea`](https://github.com/oviirup/sprite/commit/300deeaccc4c193e0343625f6d38909123f41f05) Thanks [@oviirup](https://github.com/oviirup)! - 📦 using `tinyglobby` instead of `fast-glob`

## 0.1.12

### Patch Changes

- [`ef45b71`](https://github.com/oviirup/sprite/commit/ef45b71bba29cab056a35d2c9cc8440cc779cf81) Thanks [@oviirup](https://github.com/oviirup)! - 🐛 fix improper import

  - 🐛 fixed improper import of `parse` from `node-html-parser`
  - 📦 updated dependencies

## 0.1.11

### Patch Changes

- [`ac02d96`](https://github.com/oviirup/sprite/commit/ac02d961aee10bbc3daf7d887e47e59e7669669f) Thanks [@oviirup](https://github.com/oviirup)! - 🐛 fixed improper file extension in init command

## 0.1.10

### Patch Changes

- [#18](https://github.com/oviirup/sprite/pull/18) [`d4ad62f`](https://github.com/oviirup/sprite/commit/d4ad62fbfee37c63adfcd1598c4a83806cc4fb34) Thanks [@oviirup](https://github.com/oviirup)! - 🛠️ updated sprite config

  - 🔧 updated config schema for sprite entry. [learn more](https://github.com/oviirup/sprite?tab=readme-ov-file#configuration)
  - ✅ `sprite build` is set as the default command.
  - 🚫 removed support for `.jsonc`, `.json5`
  - 🏷️ removed types generation. [learn more](https://github.com/oviirup/sprite?tab=readme-ov-file#usage)

## 0.1.9

### Patch Changes

- [`6d8dcaf`](https://github.com/oviirup/sprite/commit/6d8dcaf1330a9c1ab8d1230a7f0edbaeb3569795) Thanks [@oviirup](https://github.com/oviirup)! - 🐛 fixed watch mode

## 0.1.8

### Patch Changes

- [`d85e133`](https://github.com/oviirup/sprite/commit/d85e13379ea43c3639668941b8651dc5f2e15251) Thanks [@oviirup](https://github.com/oviirup)! - 🔍 added json schema

## 0.1.7

### Patch Changes

- [`26c34fd`](https://github.com/oviirup/sprite/commit/26c34fd0ce3e77ca90454a32e5b88a12db3e1593) Thanks [@oviirup](https://github.com/oviirup)! - 🔧 added support for json entries

  - now `.json` files can be used to define a new sprite entry
  - initialize a sprite project with json by `sprite init --json`

## 0.1.5

### Patch Changes

- [#8](https://github.com/oviirup/sprite/pull/8) [`6361a3f`](https://github.com/oviirup/sprite/commit/6361a3fcfe8140fce659bb8d59690b55195af72c) Thanks [@oviirup](https://github.com/oviirup)! - ♻️ updated build command

  - 🚚 relocated commands
  - ✨ introduced sprite store
  - 🗑️ remove dead codes

## 0.1.4

### Patch Changes

- [`412caa9`](https://github.com/oviirup/sprite/commit/412caa926b196907e6d5d98bc3418fffbb71f162) Thanks [@oviirup](https://github.com/oviirup)! - 🏷️ allow .ts file for types

  - 🏷️ Any file with .ts extension is allowed for types (previously .d.ts)
  - 📦 updated packages
  - ♻️ refactor logger

## 0.1.3

### Patch Changes

- [`cc2b531`](https://github.com/oviirup/sprite/commit/cc2b531da23b614144a0ea51667741927bc14d2f) Thanks [@oviirup](https://github.com/oviirup)! - 🔧 updated package.json config pattern

## 0.1.2

### Patch Changes

- [`7ac1593`](https://github.com/oviirup/sprite/commit/7ac15935ac5c00a98b82b0a8918e6fb86c770d2a) Thanks [@oviirup](https://github.com/oviirup)! - 📦 updated dependencies

## 0.1.1

### Patch Changes

- [`34c9606`](https://github.com/oviirup/sprite/commit/34c9606c3ab1e33e4bf0d8a42f27b6efb11c3fdf) Thanks [@oviirup](https://github.com/oviirup)! - add support for generating type definitions

## 0.1.0

### Minor Changes

- [#2](https://github.com/oviirup/sprite/pull/2) [`1310ad3`](https://github.com/oviirup/sprite/commit/1310ad38ac5dc759ee1123d33c6e128aeba7558f) Thanks [@oviirup](https://github.com/oviirup)! - updated cli

  - ✨ individual project configuration
  - ✨ `init` command to start with a blank project
  - ♻️ refactor build process

## 0.0.9

### Patch Changes

- [`07c350e`](https://github.com/oviirup/sprite/commit/07c350ea155b21349a18dffe0ad7d13654ca771f) Thanks [@oviirup](https://github.com/oviirup)! - 🔧 using resolveSvgoConfig

  - Disabled `convertPathData` in "preset-defaults" plugin.
  - Added ability to disable the svgo "preset-default" plugin by adding `svgoPlugins: { "preset-default": false }` or use a custom config.
