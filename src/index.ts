import fs from 'node:fs';
import path from 'node:path';
import pi from 'picocolors';
import { SpriteConfig } from './types';
import { resolveConfig } from './utils/config';
import { relativePath } from './utils/files';
import { getSvgIcons, logger, outputFileNames } from './utils/helpers';
import { createSpriteFiles } from './utils/sprite';

export async function build(opts: SpriteConfig) {
  const config = await resolveConfig(opts);
  const inputPath = config.input;
  const outputPath = config.output;
  const cwd = config.cwd;

  // start performance counter
  const timer = performance.now();

  const relativeInputPath = relativePath(inputPath);

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
    const files = outputFileNames(outputPath);
    Object.values(files).forEach((file) => {
      if (fs.existsSync(file)) fs.rmSync(file);
    });
  }

  if (opts.watch) {
    // TODO: work on watch mode
  }

  // get svg icons and convert to symbols
  const svgIcons = await getSvgIcons(svgFilePaths);
  // create sprite files
  const result = await createSpriteFiles({ svgIcons, outputPath, cwd, timer });

  return result;
}

export async function extract(opts: SpriteConfig) {
  const config = await resolveConfig(opts, { watch: false, clear: false });
  console.log(config);
}
