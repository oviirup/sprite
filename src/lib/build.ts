import fs from 'fs';
import path from 'path';
import { SpriteConfig, SpriteRecord, zSpriteRecord } from '@/schema';
import { resolveConfig } from '@/utils/config';
import { logger } from '@/utils/logger';
import { parse } from 'node-html-parser';
import YAML from 'yaml';
import { createSpriteFile } from '../utils/createSpriteFile';

export function build(config: Partial<SpriteConfig> = {}) {
  const cfg = resolveConfig(config);

  for (const entry of cfg.entries) {
    const entryPath = path.resolve(cfg.cwd, entry);
    if (!fs.existsSync(entryPath)) {
      logger.error(`file "${entry}" does not exists`);
      continue;
    }

    let record: SpriteRecord;
    try {
      const rawYAML = fs.readFileSync(entryPath, 'utf-8');
      const rawRecord = YAML.parse(rawYAML);
      const parsedRecord = zSpriteRecord.safeParse(rawRecord);
      if (parsedRecord.error) {
        logger.zodError(parsedRecord.error);
        continue;
      }
      record = parsedRecord.data;
    } catch {
      logger.error(`unable to parse record "${entry}"`);
      continue;
    }

    const outputPath = path.resolve(cfg.cwd, record.dest);
    createSpriteFile(record, outputPath);
  }
}
