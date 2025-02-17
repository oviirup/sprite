import fs from 'node:fs';
import path from 'node:path';
import { zSpriteRecord } from '@/lib/schema';
import { ResolvedConfig, SpriteConfig } from '@/types';
import fg from 'fast-glob';
import yaml from 'yaml';
import { z } from 'zod';
import { readFile, relativePath } from './files';
import { logger, SpriteError } from './logger';

type SpriteEntries = SpriteConfig['entries'] | undefined;

/** Resolves sprite config from input */
export function resolveConfig(config: Partial<SpriteConfig>): ResolvedConfig {
  const pkg = getPackageJson();
  if (!pkg?.content) {
    throw new SpriteError('could not find nearest package.json');
  }

  const srcA = config.entries;
  const srcB = pkg.content['sprite'];

  const cwd = config.cwd ? path.resolve(config.cwd) : process.cwd();
  const watch = config.watch ?? false;
  const entries = resolveEntries(srcA, srcB, cwd);

  return { cwd, watch, entries };
}

/** Resolve sprite entries from glob patterns */
export function resolveEntries(srcA: SpriteEntries, srcB: SpriteEntries, cwd: string) {
  // parse entries with zod
  const zEntryString = z.string({ message: 'must be a string' }).trim().min(1, 'no entry provided');
  const zEntries = z
    .union([zEntryString, z.array(zEntryString).min(1)])
    .transform((val) => (Array.isArray(val) ? val : [val]));
  const entries = zEntries.safeParse(srcA).data || zEntries.safeParse(srcB).data;
  if (!entries?.length) {
    throw new SpriteError('no entries defined. Must use at least one entry');
  }
  // get all entries with fast-glob and filter
  return fg.sync(entries, { cwd }).filter((entry) => {
    const { ext } = path.parse(entry);
    if (!/\.ya?ml$/.test(ext)) {
      logger.error(`invalid entry: ${relativePath(cwd, entry)}`, 'entries must end with ".yaml" or ".yml"');
      return false;
    }
    return true;
  });
}

/** Resolve records from entries */
export function resolveRecord(entry: string, cwd: string) {
  const entryPath = path.resolve(cwd, entry);
  const rawYAML = readFile(entryPath);
  if (!rawYAML) {
    throw new SpriteError(`unable to parse record "${entry}"`);
  }
  const rawRecord = yaml.parse(rawYAML);
  const parsedRecord = zSpriteRecord.safeParse(rawRecord);
  if (parsedRecord.error) {
    throw new SpriteError(parsedRecord.error.errors[0].message);
  }
  return parsedRecord.data;
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
