import { SpriteConfig } from '@/types';
import { resolveConfig, resolveRecord } from '@/utils/config';
import { createSpriteFiles } from '@/utils/createSpriteFiles';
import { logger, SpriteError } from '@/utils/logger';
import chokidar from 'chokidar';

/**
 * Build sprite files from records
 *
 * @param config - Sprite configuration
 */
export function build(config: Partial<SpriteConfig> = {}) {
  const cfg = resolveConfig(config);
  logger.info('initializing ...');

  if (cfg.entries.length < 1) {
    throw new SpriteError('no entries found');
  }

  for (const entry of cfg.entries) {
    const record = resolveRecord(entry, cfg.cwd);
    createSpriteFiles(record, cfg.cwd, true);
  }

  if (cfg.watch) {
    logger.info('watching entries');
    const watcher = chokidar.watch(cfg.entries, {
      ignoreInitial: true,
      cwd: cfg.cwd,
      awaitWriteFinish: true,
    });
    watcher.on('change', (entry, stats) => {
      if (stats?.isFile() && /\.ya?ml$/.test(entry)) {
        const record = resolveRecord(entry, cfg.cwd);
        createSpriteFiles(record, cfg.cwd, false);
      }
    });
    watcher.on('unlink', () => {
      logger.error('entry file is removed');
      watcher.close();
    });
  }
}
