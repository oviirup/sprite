# @oviirup/sprite

## 0.0.9

### Patch Changes

- [`07c350e`](https://github.com/oviirup/sprite/commit/07c350ea155b21349a18dffe0ad7d13654ca771f) Thanks [@oviirup](https://github.com/oviirup)! - 🔧 using resolveSvgoConfig

  - Disabled `convertPathData` in "preset-defaults" plugin.
  - Added ability to disable the svgo "preset-default" plugin by adding `svgoPlugins: { "preset-default": false }` or use a custom config.
