import fs from 'node:fs';
import path from 'node:path';
import { SpriteRecord } from '@/types';
import { getPackageJson } from '@/utils/config';
import { relativePath, writeFile } from '@/utils/files';
import { logger, SpriteError } from '@/utils/logger';
import yaml from 'yaml';

export function initialize(root?: string) {
  let cwd = root || process.cwd();
  const pkg = getPackageJson(cwd);
  const pkgContent = pkg?.content;
  if (!pkgContent) {
    throw new SpriteError('could not find nearest package.json');
  } else if (typeof pkg.content.sprite !== 'undefined') {
    throw new SpriteError('project already initiated');
  }
  // use src directory if exists
  root = path.dirname(pkg.filePath);
  cwd = path.dirname(pkg.filePath);
  if (fs.existsSync(path.join(cwd, 'src'))) {
    cwd = path.join(cwd, 'src');
  }

  const entryFileName = 'icons.sprite.yaml';
  const entryFilePath = path.join(cwd, entryFileName);
  const entryFilePath_rel = relativePath(root, entryFilePath);

  if (fs.existsSync(entryFilePath)) {
    throw new SpriteError(`file already exists: ${entryFilePath_rel}`);
  }

  const blankRecord: SpriteRecord = {
    name: 'icons',
    output: 'public/icons.svg',
    icons: [
      {
        name: 'home',
        content: `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
        attributes: { 'viewBox': '0 0 24 24', 'stroke': 'currentColor', 'stroke-width': '2' },
      },
    ],
  };

  try {
    const yamlContent = yaml.stringify(blankRecord, { lineWidth: 0 });
    const done = writeFile(entryFilePath, yamlContent);
    if (done) {
      pkgContent.sprite = entryFilePath_rel;
      const updatedPkgContent = JSON.stringify(pkgContent, null, 2);
      writeFile(pkg.filePath, updatedPkgContent);
    }
    logger.log(`created a new sprite project at ${entryFilePath_rel}`);
  } catch {}
}
