import fs from 'fs';
import { SpriteRecord } from '@/schema';
import { parse } from 'node-html-parser';
import { kebabCase } from './helpers';
import { logger } from './logger';

export function createSpriteFile({ icons, output, prefix = '' }: SpriteRecord, outputFilePath: string) {
  const symbols = icons.map(({ name, content, attributes = {} }) => {
    const xml = parse('<symbol></symbol>');
    const symbol = xml.getElementsByTagName('symbol')[0];
    symbol.setAttributes({ id: prefix.trim() + kebabCase(name), ...attributes });
    symbol.innerHTML = content;
    return `  ${symbol.toString()}`;
  });

  const spriteContent = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!-- This file is generated by @oviirup/sprite -->',
    '<svg xmlns="http://www.w3.org/2000/svg">',
    ...symbols,
    '</svg>',
  ].join('\n');

  try {
    fs.writeFileSync(outputFilePath, spriteContent);
    logger.success(`sprite created "${output}"`);
  } catch {
    logger.error('unable to write sprite file');
  }
}
