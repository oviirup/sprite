#!/usr/bin/env node
import { Command } from 'commander';
import * as pi from 'picocolors';
import { CLI } from './const';
import { build, extract } from './index';

// exit process on termination
['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL'].forEach((signal) =>
  process.on(signal, () => {
    console.log(pi.red('Exiting'));
    process.stdout.write('\x1B[?25h');
    process.exit();
  }),
);

/** Display helper text on CLI */
const text = (text: string, def?: string) => {
  return !def ? text : text + pi.dim(`  (default: ${def})`);
};

const SpriteCLI = new Command(CLI.name)
  .description(CLI.description)
  .usage(`${pi.dim('[command] [options]')}`)
  .version(CLI.version, '-v, --version')
  .helpCommand(false);

// prettier-ignore
SpriteCLI.command('build')
  .description('Generate optimized svg sprite sheet')
  .usage(`${pi.dim('[options]')}`)
  .option('-i, --input <folder>', text('Specify the input folder', 'current dir'))
  .option('-o, --output <file>', text('Specify the output file', './sprite.svg'))
  .option('-p, --prefix <string>', text('Prefix for icon names'))
  .option('-w, --watch', text('Enable watch mode, monitor the input directory', 'false'))
  .option('-c, --clear', text('Clear out output files', 'true'))
  .action(async (args) => {
    await build(args).catch(() => process.exit(1));
  });

// prettier-ignore
SpriteCLI.command('extract')
  .description('Extract svg icons from existing sprite sheet')
  .usage(`${pi.dim('[options]')}`)
  .option('-i, --input <folder>', text('Specify the input folder', 'current dir'))
  .option('-o, --output <file>', text('Specify the output file', './sprite.svg'))
  .option('-p, --prefix <string>', text('Prefix for icon names'))
  .action(extract);

SpriteCLI.parseAsync().catch(() => process.exit(1));
