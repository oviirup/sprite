import path from 'node:path';
import { SpriteStore } from '@/lib/store';
import { SpriteRecord } from '@/types';
import pi from 'picocolors';
import { writeFile } from './files';
import { getByteSize } from './helpers';
import { logger } from './logger';

export function createSpriteFiles(record: SpriteRecord, cwd: string) {
  const store = new SpriteStore(record);
  // generate sprite file
  try {
    const spriteFilePath = path.resolve(cwd, record.output);
    const content = store.toSprite();
    const result = writeFile(spriteFilePath, store.toSprite());
    const size = getByteSize(content);
    if (result) {
      logger.success(`${record.output} ${pi.dim(size)}`);
    } else {
      logger.log(`${record.output} ${pi.dim('no change')}`);
    }
  } catch {
    logger.error('unable to write sprite file');
  }
}
