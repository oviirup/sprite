import path from 'node:path';
import { CLI, DEFAULT_OPTIONS } from '@/const';
import {
  Entries,
  ResolvedConfig,
  ResolvedEntries,
  SpriteConfig,
} from '@/types';
import { cosmiconfig } from 'cosmiconfig';

export async function resolveConfig(opts: SpriteConfig) {
  // get sprite config from config files or package.json
  // it can be stored in sprite.config.js , .spriterc.json etc...
  const res = await cosmiconfig(CLI.name).search();
  const packageConfig = !!res && !res.isEmpty ? res.config : {};
  const configFile = res?.filepath || null;

  // merged config
  const config = Object.assign(DEFAULT_OPTIONS, packageConfig, opts);

  // resolve input file paths
  config.configFile = configFile;
  config.cwd = path.resolve(process.cwd(), config.cwd);
  config.entries = resolveEntries(config.entries, config.cwd);

  config.watch ??= process.env.NODE_ENV === 'development';
  config.clear ??= false;
  config.iconPrefix ??= '';
  config.svgoPlugins ??= [];

  // default output file suffix
  config.outFileSuffix ??= {};
  config.outFileSuffix.sprite ??= '';
  config.outFileSuffix.meta ??= '';

  return config as ResolvedConfig;
}

export function resolveEntries(entries: Entries, cwd: string): ResolvedEntries {
  const getFileName = (inputPath: string, withDir = false) => {
    let dir = withDir ? path.dirname(inputPath) : '';
    let fileName = path.basename(inputPath);
    fileName = fileName.replace(/^[._]/, '');
    return path.join(dir, fileName + '.svg'); // remove leading "dot" or "underscore"
  };

  const resolvePath = (entry: string, ...paths: string[]) => {
    return path.resolve(cwd, path.dirname(entry), ...paths);
  };

  if (Array.isArray(entries)) {
    return entries.map((entry) => ({
      input: path.resolve(cwd, entry),
      output: resolvePath(entry, getFileName(entry)),
    }));
  } else if (entries !== null && typeof entries === 'object') {
    return Object.entries(entries).map(([output, input]) => ({
      input: path.resolve(cwd, input),
      output: resolvePath(input, getFileName(output, true)),
    }));
  }
  return [];
}
