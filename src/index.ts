import fs from 'node:fs';
import path from 'node:path';
import pi from 'picocolors';
import { ResolvedConfig, SpriteConfig } from './types';
import { resolveConfig } from './utils/config';
import { relativePath } from './utils/files';
import { getSvgIcons, logger, outputFileNames } from './utils/helpers';
import { createSpriteFiles } from './utils/sprite';

export type { SpriteConfig, ResolvedConfig };

export async function build(opts: SpriteConfig, rebuild?: boolean) {
  const config = await resolveConfig(opts);
  const inputPath = config.input;
  const outputPath = config.output;
  const cwd = config.cwd;

  // start performance counter
  const timer = performance.now();

  const relativeInputPath = relativePath(inputPath, cwd);

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

  if (config.clear) {
    // clear out previous builds
    const files = outputFileNames(outputPath, config.outputFileSuffix);
    Object.values(files).forEach((file) => {
      if (fs.existsSync(file)) fs.rmSync(file);
    });
  }

  // get svg icons and convert to symbols
  const svgIcons = await getSvgIcons(svgFilePaths);
  // create sprite files
  createSpriteFiles({ svgIcons, config, timer });
  // watch for changes
  config.watch && watch(config);
}

async function watch(config: ResolvedConfig) {
  const { watch } = await import('chokidar');
  const cwd = config.cwd;
  const inputPath = config.input;

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
    build(config);
    logger(`Rebuild finished`, begin);
  });
}

export async function extract(opts: SpriteConfig) {
  const config = await resolveConfig({ ...opts, watch: false, clear: false });
  console.log(config);
}
