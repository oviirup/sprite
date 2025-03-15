import { z } from 'zod';

export const zString = (params?: z.RawCreateParams) => z.coerce.string(params).trim();

/** Name of the icon, (in lowercase) */
export const zIconName = zString({ message: 'invalid name' })
  .regex(/^(?:[-a-z\d]*)$/, { message: 'invalid name, must be a kabab-case string' })
  .min(1, { message: '"name" is required' })
  .describe('Name of the icon, (should be in lowercase)');

export const zIcon = z.object(
  {
    /** Inner content of the svg icon */
    content: zString({ message: 'invalid content' })
      .min(1, { message: '"content" must not be empty' })
      .describe('Inner content of the svg icon'),
    /** SVG attributes */
    attributes: z
      .record(zString(), { message: 'invalid attributes' })
      .default({})
      .optional()
      .describe('SVG attributes'),
    /** Tags for the icon for search, (optional) */
    tags: z
      .array(zString(), { message: 'invalid tags' })
      .default([])
      .optional()
      .describe('Tags for the icon for search, (optional)'),
  },
  { message: 'invalid icon data' },
);

export const zRawIconValue = z.union([zIcon, zString()]).transform((value) => {
  return typeof value === 'string' ? { content: value } : value;
});

export const zIconRecord = z
  .record(zIconName, zRawIconValue, { message: 'invalid icons' })
  .superRefine((value, ctx) => {
    const icons = Object.keys(value);
    const iconNamesSet = new Set<string>();
    // check if all the icons names are unique
    for (const iconName of icons) {
      if (!iconNamesSet.has(iconName)) {
        iconNamesSet.add(iconName);
        continue;
      }
      ctx.addIssue({ code: 'custom', path: ctx.path, message: `icon name "${iconName}" is not unique` });
      break;
    }
  })
  .describe('Icon record');

export const zSpriteRecord = z.object(
  {
    /** Name of the sprite project */
    name: zString({ message: 'invalid name' })
      .min(1, { message: '"name" is required' })
      .describe('Name of the sprite project'),
    /** Prefix for icon names, with no empty-space (default: "") */
    prefix: zString({ message: 'invalid prefix' })
      .regex(/[a-zA-Z\d]*/, { message: 'invalid prefix' })
      .default('')
      .optional()
      .describe('Prefix for icon names, with no empty-space'),
    /** Output path of sprite file, relative to cwd */
    output: zString({ message: 'invalid output' })
      .regex(/\.svg$/, { message: 'output file must end with .svg extension' })
      .min(1, { message: '"output" is required' })
      .describe('Output path of sprite file, relative to cwd'),
    /** Icon sets */
    icons: zIconRecord,
  },
  { message: 'invalid sprite record' },
);

const zEntryString = z.string({ message: 'must be a string' }).trim();
export const zEntries = z
  .union([zEntryString, z.array(zEntryString).min(1)])
  .transform((val) => (Array.isArray(val) ? val : [val]));
