#!/usr/bin/env node
import { build } from '@/lib/build';
import { logger } from '@/utils/logger';
import { Command } from 'commander';
import pi from 'picocolors';
import pkg from '../package.json';

const CLI = {
  name: pkg.displayName,
  desc: pkg.description,
  version: pkg.version,
};

const SpriteCLI = new Command(CLI.name)
  .description(CLI.desc)
  .usage(`${pi.dim('[command] [options]')}`)
  .version(CLI.version, '-v, --version')
  .helpCommand(false);

// define build command -->
SpriteCLI.command('build')
  .description('generate optimized svg sprite sheet')
  .usage(`${pi.dim('[options]')}`)
  .argument('<entries...>', 'specify the input paths')
  .option('-w, --watch', 'enable watch mode, monitor the input directory')
  .option('--cwd', 'specify working directory')
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
