import fs from 'node:fs';
import path from 'node:path';
import { ResolvedConfig, ResolvedEntries, SpriteConfig } from '@/types';
import { resolveConfig } from '@/utils/config';
import { createSpriteFiles } from '@/utils/createSprite';
import { relativePath } from '@/utils/files';
import { getSvgIcons, logger, outputFileNames } from '@/utils/helpers';
import pi from 'picocolors';

export type { ResolvedConfig, SpriteConfig };

export async function build(opts: SpriteConfig) {
  const config = await resolveConfig(opts);
  const entries = config.entries;

  // exit build if no entries provided
  if (entries.length === 0) {
    let _error = `Invalid entries`;
    logger(pi.red(_error));
    logger(pi.dim(`Make sure add entries as array or object to the config\n`));
    return { error: _error };
  }

  Promise.all(
    entries.map(({ input, output }) => {
      return iterateThroughEntries(input, output, config);
    }),
  );
}

async function iterateThroughEntries(
  inputPath: string,
  outputPath: string,
  config: ResolvedConfig,
) {
  const cwd = config.cwd;
  const relativeInputPath = relativePath(inputPath, cwd);
  // start performance counter
  const timer = performance.now();

  // exit build if input path does not exists
  if (!fs.existsSync(inputPath)) {
    let _error = `${relativeInputPath} does not exists`;
    logger(pi.red(_error));
    logger(pi.dim(`Make sure you've entered the correct input path\n`));
    return { error: _error };
  }

  // get all svg files form input directory
  const svgFilePaths = fs
    .readdirSync(inputPath)
    .filter((filePath) => filePath.endsWith('.svg'))
    .map((filePath) => path.resolve(inputPath, filePath));

  // throw error if no icon files found
  if (svgFilePaths.length === 0) {
    let _error = `No SVG files found in ${relativeInputPath}`;
    logger(pi.red(_error));
    logger(`Make sure to keep all svg icons in mentioned path\n`);
    return { error: _error };
  }

  // clear out previous builds
  if (config.clear) {
    const files = outputFileNames(outputPath, config.outFileSuffix);
    Object.values(files).forEach((file) => {
      if (fs.existsSync(file)) fs.rmSync(file);
    });
  }

  // get svg icons and convert to symbols
  const svgIcons = await getSvgIcons(svgFilePaths);
  // create sprite files
  createSpriteFiles({ svgIcons, outputPath, config, timer });
  // watch for changes
  config.watch && watchEntries(inputPath, outputPath, config);
}

async function watchEntries(
  inputPath: string,
  outputPath: string,
  config: ResolvedConfig,
) {
  const { watch } = await import('chokidar');
  const cwd = config.cwd;

  logger(`watching for changes in ${relativePath(inputPath, cwd)} `);

  const watcher = watch(inputPath, {
    cwd,
    ignoreInitial: true, // ignore initial scan
    awaitWriteFinish: { stabilityThreshold: 50, pollInterval: 10 },
  }).on('all', (event, fileName) => {
    if (event === 'addDir' || event === 'unlinkDir') return; // ignore dir changes
    if (fileName == null) return;
    const begin = performance.now();
    watcher.close();
    iterateThroughEntries(inputPath, outputPath, config);
    logger(`Rebuild finished`, begin);
  });
}
