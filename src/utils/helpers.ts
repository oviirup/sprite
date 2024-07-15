import { createHash } from 'node:crypto';
import path from 'node:path';
import pi from 'picocolors';
import { CLI } from '../const';
import { IconData, ResolvedConfig, SpriteConfig } from '../types';
import { composeFileName, readFile } from './files';

export async function getSvgIcons(filePaths: string[]) {
  const icons: IconData[] = [];
  // read icon files and create an array
  await Promise.all(
    filePaths.map(async (filePath) => {
      const content = await readFile(filePath);
      if (!content) return;
      const iconName = getIconName(filePath);
      icons.push({ path: filePath, name: iconName, content });
    }),
  );
  const sortedIcons = icons.sort((a, b) => {
    const collector = new Intl.Collator('en');
    return collector.compare(a.name, b.name);
  });
  return sortedIcons;
}

export function getIconName(fileName: string) {
  const basename = path.basename(fileName).trim();
  return basename
    .replace(/\.svg$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\W/g, (m) => (/[À-ž]/.test(m) ? m : '-'))
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

export function outputFileNames(
  outputPath: string,
  suffix: ResolvedConfig['outputFileSuffix'],
) {
  const sprite = composeFileName(outputPath, {
    ext: '.svg',
    suffix: suffix.sprite,
  });
  const meta = composeFileName(outputPath, {
    ext: '.json',
    suffix: suffix.meta,
  });

  return { sprite, meta };
}

export function getByteSize(content: string) {
  if (!content) return 0;
  return Buffer.byteLength(content, 'utf-8');
}

export function getHash(content: string, length = 6) {
  const hash = createHash('md5').update(content).digest('hex');
  const base36Hash = BigInt('0x' + hash).toString(36);
  return base36Hash.substring(0, length);
}

export function logger(msg: string, begin?: number) {
  const identifier = pi.dim(`[${CLI.name.toUpperCase()}]`);
  const time = begin ? `in ${(performance.now() - begin).toFixed(2)}ms` : '';
  // removes all reference of working directory
  const message = msg.replaceAll(process.cwd(), '');

  console.log(identifier, message, pi.dim(time));
}
