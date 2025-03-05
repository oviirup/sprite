# @oviirup/sprite

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
