import path from 'path';
import { SpriteConfig } from '@/schema';
import { resolveConfig, resolveRecords } from '@/utils/config';
import { createSpriteFile } from '@/utils/createSpriteFile';
import { createTypesFile } from '@/utils/createTypesFile';
import { logger, SpriteError } from '@/utils/logger';
import chokidar from 'chokidar';

/**
 * Build sprite files from records
 *
 * @param config - Sprite configuration
 */
export function build(config: Partial<SpriteConfig> = {}) {
  const cfg = resolveConfig(config);
  logger.log('initializing ...');

  if (cfg.entries.length < 1) {
    throw new SpriteError('no entries found');
  }

  const internalRunBuild = () => {
    for (const record of resolveRecords(cfg)) {
      const outputFilePath = path.resolve(cfg.cwd, record.output);
      createSpriteFile(record, outputFilePath);
      // write types file
      if (record.types) {
        const typesFilePath = path.resolve(cfg.cwd, record.types);
        createTypesFile(record, typesFilePath);
      }
    }
  };

  internalRunBuild();

  if (cfg.watch) {
    logger.log('watching files');
    for (const entry of cfg.entries) {
      logger.log(null, entry);
    }
    const watcher = chokidar.watch(cfg.entries, {
      ignoreInitial: true,
      cwd: cfg.cwd,
      awaitWriteFinish: true,
    });
    watcher.on('change', () => {
      logger.log('entry file updated');
      internalRunBuild();
    });
    watcher.on('unlink', () => {
      logger.error('entry file is removed');
      watcher.close();
    });
  }
}
