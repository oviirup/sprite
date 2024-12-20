#!/usr/bin/env node
import { PKG_DESC, PKG_NAME, PKG_VERSION } from '@/const';
import { build } from '@/lib/build';
import { logger } from '@/utils/logger';
import { Command } from 'commander';
import pi from 'picocolors';
import { initialize } from './lib/init';

const SpriteCLI = new Command(PKG_NAME)
  .description(PKG_DESC)
  .usage(`${pi.dim('[command] [options]')}`)
  .version(PKG_VERSION, '-v, --version')
  .helpCommand(false);

// define init command -->
SpriteCLI.command('init')
  .description('generate optimized svg sprite sheet')
  .usage(`${pi.dim('[options]')}`)
  .option('--cwd', 'specify working directory')
  .action((args, opts) => {
    initialize(opts.cwd);
  });

// define build command -->
SpriteCLI.command('build')
  .description('generate optimized svg sprite sheet')
  .usage(`${pi.dim('[options] [entries...]')}`)
  .argument('[entries...]', 'specify the input paths')
  .option('-w, --watch', 'enable watch mode, monitor the input directory')
  .option('    --cwd', 'specify working directory')
  .action((args, opts) => {
    build({ entries: args, ...opts });
  });

SpriteCLI.parseAsync().catch(() => process.exit(1));

// exit process on termination
for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL']) {
  process.on(signal, () => {
    logger.log(pi.yellow, 'Exiting ...');
    process.stdout.write('\x1B[?25h');
    process.exit();
  });
}
