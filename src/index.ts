import fs from 'node:fs';
import path from 'node:path';
import * as pi from 'picocolors';
import { SpriteConfig } from './types';
import { resolveConfig } from './utils/config';
import { getSvgIcons, outputFileNames } from './utils/helpers';
import { createSpriteFiles } from './utils/sprite';

export async function build(opts: SpriteConfig) {
  const config = await resolveConfig(opts);
  const inputPath = config.input;
  const outputPath = config.output;
  const cwd = config.cwd;

  const relativeInputPath = path
    .relative(config.cwd, inputPath)
    .replace(/\\/g, '/');

  // exit build if input path does not exists
  if (!fs.existsSync(inputPath)) {
    console.log(pi.red(`${relativeInputPath} does not exists`));
    console.log(`Make sure you've entered the correct input path\n`);
    process.exit(1);
  }

  // get all svg files form input directory
  const svgFilePaths = fs
    .readdirSync(inputPath)
    .filter((filePath) => filePath.endsWith('.svg'))
    .map((filePath) => path.resolve(inputPath, filePath));

  // throw error if no icon files found
  if (svgFilePaths.length === 0) {
    console.log(pi.red(`No SVG files found in ${relativeInputPath}`));
    console.log(`Make sure to keep all svg icons in mentioned path\n`);
    process.exit(1);
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
  await createSpriteFiles({ svgIcons, outputPath, cwd });
}

export async function extract(opts: SpriteConfig) {
  const config = await resolveConfig(opts, { watch: false, clear: false });
  console.log(config);
}
