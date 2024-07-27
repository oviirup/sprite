---
'@oviirup/sprite': patch
---

🔧 using resolveSvgoConfig

- Disabled `convertPathData` in "preset-defaults" plugin.
- Added ability to disable the svgo "preset-default" plugin by adding `svgoPlugins: { "preset-default": false }` or use a custom config.
