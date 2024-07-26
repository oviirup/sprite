import fs from 'node:fs';
import { ResolvedConfig, ResolvedEntries, SpriteConfig } from '@/types';
import { resolveConfig } from '@/utils/config';
import { extractSprite } from '@/utils/extractSprite';
import { readFile, relativePath } from '@/utils/files';
import { logger, outputFileNames } from '@/utils/helpers';
import pi from 'picocolors';

export async function extract(opts?: SpriteConfig) {
  const config = await resolveConfig(opts);
  const entries = config.entries;

  // loop through each entries
  for (const entry of entries) {
    await extractEntry({ entry, config });
  }
}

type ExtractEntryProps = {
  entry: ResolvedEntries[0];
  config: ResolvedConfig;
};
export async function extractEntry({ entry, config }: ExtractEntryProps) {
  const inputPath = entry.input;
  const outputPath = entry.output;
  const cwd = config.cwd;
  // start performance counter
  const timer = performance.now();

  const outFiles = outputFileNames(outputPath, config.outFileSuffix);
  const spriteFile = outFiles.sprite;
  const relativeInputPath = relativePath(spriteFile, cwd);

  // exit build if input path does not exists
  if (!fs.existsSync(spriteFile)) {
    const _error = `${relativeInputPath} does not exist`;
    logger(pi.red(_error));
    return;
  }

  logger(pi.dim(`Extracting "${relativeInputPath}"`));

  // get output sprite file content
  const svgSprite = (await readFile(spriteFile))!;
  // extract svg icons
  await extractSprite({ svgSprite, outputPath: inputPath, config, timer });
}
