import fs from 'fs';
import path from 'path';
import { ResolvedConfig, SpriteConfig, SpriteRecord, zSpriteRecord } from '@/schema';
import fg from 'fast-glob';
import yaml from 'yaml';
import { readFile } from './files';
import { logger } from './logger';

/** Resolves sprite config from input */
export function resolveConfig(config: Partial<SpriteConfig>): ResolvedConfig {
  const pkgConfig = getPackageConfig();
  const cfg = Object.assign(pkgConfig, config);
  const cwd = cfg.cwd ? path.resolve(cfg.cwd) : process.cwd();
  const watch = cfg.watch ?? false;
  const entries = resolveEntries(cfg.entries, cwd);

  return { cwd, watch, entries };
}

/** Resolve sprite entries from glob patterns */
export function resolveEntries(entries: SpriteConfig['entries'] | undefined, cwd: string) {
  entries = Array.isArray(entries) ? entries : typeof entries === 'string' ? [entries.trim()] : [];
  entries = entries.filter((e) => !!e.trim());

  if (entries.length === 0) {
    throw new Error(`[SPRITE] No entries defined. Must use at least one entry`);
  }

  for (const entry of entries) {
    try {
      const { ext } = path.parse(entry);
      if (!entry.startsWith('!') && !/\.ya?ml/.test(ext)) {
        throw new Error(`[SPRITE] Invalid entry: must end with .yaml / .yml`);
      }
    } catch {
      logger.error('Unable to parse entry\n');
      throw new Error();
    }
  }

  return fg.sync(entries, { cwd });
}

/** Resolve records from entries */
export function resolveRecords({ entries, cwd }: ResolvedConfig) {
  const spriteRecords: SpriteRecord[] = [];
  for (const entry of entries) {
    const entryPath = path.resolve(cwd, entry);
    try {
      const rawYAML = readFile(entryPath);
      if (!rawYAML) continue;
      const rawRecord = yaml.parse(rawYAML);
      const parsedRecord = zSpriteRecord.safeParse(rawRecord);
      if (parsedRecord.error) {
        logger.zodError(parsedRecord.error);
        continue;
      }
      const record = parsedRecord.data;
      spriteRecords.push(record);
    } catch {
      logger.error(`unable to parse record "${entry}"`);
      continue;
    }
  }
  return spriteRecords;
}

/** Get sprite config form nearest package.json */
export function getPackageConfig(root?: string): Partial<SpriteConfig> {
  let cwd = root ?? process.cwd();
  while (true) {
    const filePath = path.join(cwd, 'package.json');
    try {
      if (fs.existsSync(filePath)) {
        const content = readFile(filePath) ?? '{}';
        return JSON.parse(content).sprite || {};
      }
    } catch {
      return {};
    }
    const parent = path.dirname(cwd);
    if (parent === cwd) return {};
    cwd = parent;
  }
}
