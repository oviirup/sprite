import path from 'node:path';
import { cosmiconfig } from 'cosmiconfig';
import { CLI, DEFAULT_OPTIONS } from '../const';
import { ResolvedConfig, SpriteConfig } from '../types';

export async function resolveConfig(
  opts: SpriteConfig,
  overrides: SpriteConfig = {},
) {
  // get sprite config defined in package.json
  const packageConfig = await cosmiconfig(CLI.name)
    .search()
    .then((res) => res?.config ?? {});

  // merged config
  const config = Object.assign(
    DEFAULT_OPTIONS,
    packageConfig,
    opts,
    overrides,
  ) as ResolvedConfig;

  config.cwd = path.resolve(process.cwd(), config.cwd);
  config.watch ??= process.env.NODE_ENV === 'development';
  config.clear ??= false;
  config.input = path.resolve(config.cwd, config.input);
  config.output = path.resolve(config.cwd, config.output);
  config.prefix ??= '';
  config.svgoPlugins ??= [];

  return config;
}
