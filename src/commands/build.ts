import fs from 'node:fs';
import path from 'node:path';
import { ResolvedConfig, ResolvedEntries, SpriteConfig } from '@/types';
import { resolveConfig } from '@/utils/config';
import { createSpriteFiles } from '@/utils/createSprite';
import { relativePath } from '@/utils/files';
import { getSvgIcons, logger, outputFileNames } from '@/utils/helpers';
import pi from 'picocolors';
import { extractEntry } from './extract';

export type { ResolvedConfig, SpriteConfig };

export async function build(opts?: SpriteConfig) {
  const config = await resolveConfig(opts);
  const entries = config.entries;

  if (entries.length === 0) {
    const _error = `Invalid entries`;
    logger(pi.red(_error));
    logger(pi.dim(`Make sure to add entries to the config\n`));
    return { error: _error };
  }

  await processEntries(entries, config);
}

async function processEntries(
  entries: ResolvedEntries,
  config: ResolvedConfig,
) {
  const cwd = config.cwd;
  const configFile = config.configFile;
  // start performance counter
  const timer = performance.now();

  // loop through each entries
  for (const entry of entries) {
    const inputPath = entry.input;
    const outputPath = entry.output;
    const relativeInputPath = relativePath(inputPath, cwd);

    const outFiles = outputFileNames(outputPath, config.outFileSuffix);

    const inputPathExists = fs.existsSync(inputPath);
    const svgFilePaths = inputPathExists
      ? fs
          .readdirSync(inputPath)
          .filter((filePath) => filePath.endsWith('.svg'))
          .map((filePath) => path.resolve(inputPath, filePath))
      : [];

    // exit build if input path does not exists, or has not svg icons
    if (!fs.existsSync(inputPath) || svgFilePaths.length === 0) {
      if (fs.existsSync(outFiles.sprite)) {
        await extractEntry({ entry, config });
        continue;
      } else {
        logger(pi.red(`Entry "${relativeInputPath}" does not exist`));
        logger(pi.dim(`Make sure you've entered the correct input path\n`));
        continue;
      }
    }

    // throw error if no icon files found
    if (svgFilePaths.length === 0) {
      const _error = `No SVG files found in ${relativeInputPath}`;
      logger(pi.red(_error));
      logger(`Make sure to keep all svg icons in the mentioned path\n`);
      continue;
    }

    // clear out previous build files
    if (config.clear) {
      Object.values(outFiles).forEach((file) => {
        if (fs.existsSync(file)) fs.rmSync(file);
      });
    }

    // get svg icons and convert to symbols
    const svgIcons = await getSvgIcons(svgFilePaths);
    // create sprite files
    await createSpriteFiles({ svgIcons, outputPath, config, timer });
  }

  // watch for changes
  if (config.watch) {
    const { watch } = await import('chokidar');
    const watchPaths = entries.map((e) => e.input); // watch all entries
    configFile && watchPaths.push(configFile); // watch the config file

    logger(`Watching for changes`);

    const watcher = watch(watchPaths, {
      ignoreInitial: true, // ignore initial scan
      awaitWriteFinish: { stabilityThreshold: 50, pollInterval: 10 },
    });

    watcher.on('all', (event, fileName) => {
      if (event === 'addDir' || event === 'unlinkDir') return;
      if (!fileName) return;
      const timer = performance.now();
      watcher.close();
      processEntries(entries, config);
      logger(`Rebuild finished`, timer);
    });
  }
}
