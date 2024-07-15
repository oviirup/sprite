import path from 'node:path';
import { cosmiconfig } from 'cosmiconfig';
import { CLI, DEFAULT_OPTIONS } from '../const';
import { ResolvedConfig, SpriteConfig } from '../types';

export async function resolveConfig(opts: SpriteConfig) {
  // get sprite config from config files or package.json
  // it can be stored in sprite.config.js , .spriterc.json etc...
  const packageConfig = await cosmiconfig(CLI.name)
    .search()
    .then((res) => res?.config ?? {});

  // merged config
  const config = Object.assign(DEFAULT_OPTIONS, packageConfig, opts);

  config.cwd = path.resolve(process.cwd(), config.cwd);
  config.watch ??= process.env.NODE_ENV === 'development';
  config.clear ??= false;
  config.input = path.resolve(config.cwd, config.input);
  config.output = path.resolve(config.cwd, config.output);
  config.prefix ??= '';
  config.svgoPlugins ??= [];
  // default output file suffix
  config.outputFileSuffix ??= {};
  config.outputFileSuffix.sprite ??= '';
  config.outputFileSuffix.meta ??= '';

  return config as ResolvedConfig;
}
