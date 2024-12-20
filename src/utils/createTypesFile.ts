import { exec, execSync } from 'child_process';
import { SpriteRecord } from '@/schema';
import { writeFile } from './files';
import { kebabCase, pascalCase } from './helpers';
import { logger } from './logger';

export function createTypesFile({ name, icons, prefix = '' }: SpriteRecord, outputFilePath: string) {
  const types = icons.map((icon) => {
    const id = prefix.trim() + kebabCase(icon.name);
    return `  | ${JSON.stringify(id)}`;
  });

  const declarationName = `${pascalCase(name)}Name`;

  const spriteContent = [`export type ${declarationName} =`, ...types, ''].join('\n');

  try {
    writeFile(outputFilePath, spriteContent);
  } catch {
    logger.error('unable to write types file');
  }
}
