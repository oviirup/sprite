import fs from 'fs';
import path from 'path';
import { ResolvedConfig, SpriteConfig, SpriteRecord, zSpriteRecord } from '@/schema';
import fg from 'fast-glob';
import yaml from 'yaml';
import { z } from 'zod';
import { readFile } from './files';
import { logger, SpriteError } from './logger';

/** Resolves sprite config from input */
export function resolveConfig(config: Partial<SpriteConfig>): ResolvedConfig {
  const pkg = getPackageJson();
  if (!pkg?.content) {
    throw new SpriteError('could not find nearest package.json');
  }
  const cfg: Partial<SpriteConfig> = pkg.content['sprite'];

  const zEntryString = z.string().min(1);
  const zEntries = z
    .union([zEntryString, z.array(zEntryString).min(1)])
    .transform((val) => (typeof val === 'string' ? [val] : val));
  const parsedEntries = zEntries.safeParse(config.entries);

  cfg.cwd ??= config.cwd;
  cfg.watch ??= config.watch;
  if (parsedEntries.data?.length) {
    cfg.entries = parsedEntries.data;
  }

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
    throw new SpriteError('no entries defined. Must use at least one entry');
  }

  for (const entry of entries) {
    const { ext } = path.parse(entry);
    if (!entry.startsWith('!') && !/\.ya?ml$/.test(ext)) {
      logger.error('invalid entry: must end with ".yaml" or ".yml"');
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

/** Get the nearest package.json */
export function getPackageJson(cwd?: string, maxDepth: number = 10) {
  cwd ??= process.cwd();
  let currentDepth = 0;

  while (currentDepth <= maxDepth) {
    const filePath = path.join(cwd, 'package.json');
    try {
      if (fs.existsSync(filePath)) {
        const raw = readFile(filePath) || JSON.stringify({});
        const content = JSON.parse(raw) as Record<string, any>;
        return { content, filePath };
      }
    } catch {
      return null;
    }
    const parent = path.dirname(cwd);
    if (parent === cwd) break; // Reached the filesystem root
    cwd = parent;
    currentDepth++;
  }
  return null;
}
