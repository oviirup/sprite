import { Icon, SpriteRecord } from '@/types';
import { kebabCase, pascalCase } from '@/utils/helpers';
import { SpriteError } from '@/utils/logger';
import parse from 'node-html-parser';
import { zIcon, zSpriteRecord } from './schema';

export class SpriteStore {
  readonly name: string;
  readonly prefix: string;
  readonly icons: Icon[];

  protected _sprite: string | null = null;
  protected _typedef: string | null = null;

  constructor(record: SpriteRecord) {
    const parsedRecord = zSpriteRecord.safeParse(record);
    if (!parsedRecord.success) {
      throw new SpriteError(parsedRecord.error.errors.map((e) => e.message).join(', '));
    }
    this.name = record.name;
    this.prefix = record.prefix?.trim() || '';
    this.icons = record.icons;
  }

  /**
   * Retrieves an icon by its name.
   *
   * @param name - The name of the icon to retrieve.
   * @returns The icon object or undefined if not found.
   */
  get(name: string): Icon | undefined {
    return this.icons.find((icon) => icon.name === name);
  }

  /**
   * Adds or updates an icon by its name.
   *
   * @param name - The name of the icon.
   * @param icon - The icon object to set.
   * @returns The index of the Icon that is added or modified
   */
  set(name: string, icon: Icon): number {
    const parsedIcon = zIcon.safeParse(icon);
    if (!parsedIcon.success) {
      throw new SpriteError(parsedIcon.error.errors[0].message);
    }

    const index = this.icons.findIndex((icon) => icon.name === name);
    if (index >= 0) {
      this.icons[index] = parsedIcon.data;
      return index;
    } else {
      return this.icons.push(parsedIcon.data) - 1;
    }
  }

  /**
   * Deletes an icon by its name.
   *
   * @param name - The name of the icon to delete.
   * @returns True if the icon was deleted, false if it didn't exist.
   */
  delete(name: string): boolean {
    const index = this.icons.findIndex((icon) => icon.name === name);
    if (index > -1) {
      this.icons.splice(index, 1);
      return true;
    }
    return false;
  }

  /** Generates raw svg sprite sheet */
  toSprite() {
    if (this._sprite !== null) {
      return this._sprite;
    }

    const symbols = this.icons.map(({ name, content, attributes = {} }) => {
      const xml = parse('<symbol/>');
      const symbol = xml.querySelector('symbol')!;
      const id = this.prefix + kebabCase(name);
      symbol.setAttributes({ id, ...attributes });
      symbol.innerHTML = content;
      return `  ${symbol.toString()}`;
    });
    const content = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<!-- This file is generated by @oviirup/sprite -->',
      '<svg xmlns="http://www.w3.org/2000/svg">',
      ...symbols,
      '</svg>',
    ].join('\n');

    return content;
  }

  /** Generates type definitions from icons names */
  toTypedef() {
    if (this._typedef !== null) {
      return this._typedef;
    }

    const types = this.icons.map((icon) => {
      const id = this.prefix + kebabCase(icon.name);
      return `  | ${JSON.stringify(id)}`;
    });
    const content = [
      '// This file is generated by @oviirup/sprite',
      '',
      `export type ${pascalCase(this.name)}Name =`,
      ...types,
      '',
    ].join('\n');

    return content;
  }

  protected clearInternalCache() {
    this._sprite = null;
    this._typedef = null;
  }
}
