import { description, displayName, version } from '../package.json';
import { SpriteConfig } from './types';

export const CLI = { name: displayName, version, description };

/** Default options for sprite generator */
export const DEFAULT_OPTIONS: SpriteConfig = {
  cwd: process.cwd(),
  entries: ['./public/.icons'],
};
