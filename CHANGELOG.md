# @oviirup/sprite

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
