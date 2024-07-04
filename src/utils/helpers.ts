import { createHash } from 'node:crypto';
import path from 'node:path';
import { IconData } from '../types';
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

export function outputFileNames(outputPath: string) {
  const sprite = composeFileName(outputPath, { ext: '.svg' });
  const meta = composeFileName(outputPath, { suffix: '.meta', ext: '.json' });

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
