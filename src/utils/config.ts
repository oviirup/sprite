import fs, { cpSync } from 'fs';
import path from 'path';
import { ResolvedConfig, SpriteConfig } from '@/schema';
import fg from 'fast-glob';

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

  if (entries.length === 0) {
    throw new Error(`[SPRITE] No entries defined. Must use at least one entry`);
  }

  for (const entry of entries) {
    try {
      const { ext } = path.parse(entry);
      if (!/\.ya?ml/.test(ext)) throw new Error(`[SPRITE] Invalid entry: must end with .yaml / .yml`);
    } catch {
      throw new Error(`[SPRITE] Unable to parse entry`);
    }
  }

  return fg.sync(entries, { cwd });
}

/** Get sprite config form nearest package.json */
export function getPackageConfig(root?: string): Partial<SpriteConfig> {
  let cwd = root ?? process.cwd();
  while (true) {
    const filePath = path.join(cwd, 'package.json');
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
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
