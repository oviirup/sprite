import { description, displayName, version } from '../package.json';

export const CLI = { name: displayName, version, description };

/**
 * Default options for sprite generator
 *
 * @type {Required<SpriteOptions>}
 */
export const DEFAULT_OPTIONS = {
  cwd: './',
  input: './public/.icons',
  output: './public/sprite.svg',
  dts: null,
  extract: false,
  prefix: '',
  emit: true,
};
