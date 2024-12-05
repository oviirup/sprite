import path from 'path';
import { ResolvedConfig, SpriteConfig } from '@/schema';
import { resolveConfig, resolveRecords } from '@/utils/config';
import chokidar from 'chokidar';
import { createSpriteFile } from '../utils/createSpriteFile';

/**
 * Build sprite files from records
 *
 * @param config - Sprite configuration
 */
export function build(config: Partial<SpriteConfig> = {}) {
  const cfg = resolveConfig(config);

  const internalRunBuild = () => {
    for (const record of resolveRecords(cfg)) {
      const outputFilePath = path.resolve(cfg.cwd, record.output);
      createSpriteFile(record, outputFilePath);
    }
  };

  internalRunBuild();

  if (cfg.watch) {
    const watcher = chokidar.watch(cfg.entries, {
      ignoreInitial: true,
      cwd: cfg.cwd,
      awaitWriteFinish: true,
    });
    watcher.on('change', internalRunBuild);
  }
}
