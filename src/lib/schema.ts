import { z } from 'zod';

export const zString = (params?: z.RawCreateParams) => z.coerce.string(params).trim();

export const zIcon = z.object(
  {
    /** Name of the icon, (in lowercase) */
    name: zString({ message: 'invalid name' })
      .regex(/^(?:[-a-z\d]*)$/, { message: 'invalid name, must be a kabab-case string' })
      .min(1, { message: '"name" is required' })
      .describe('Name of the icon, (should be in lowercase)'),
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
    /** Output type definition file, relative to cwd */
    types: zString({ message: 'invalid types' })
      .regex(/\.ts$/, { message: 'output file must end with .ts extension' })
      .optional()
      .describe('Output path of type definition file, relative to cwd'),
    /** Icon sets */
    icons: z
      .array(zIcon, { message: 'invalid icons' })
      .default([])
      .superRefine((icons, ctx) => {
        const names = new Set();
        for (let i = 0; i < icons.length; i++) {
          const icon = icons[i];
          if (names.has(icon.name)) {
            // Add an error for the current icon index
            const issuePath = [i, 'name'];
            ctx.addIssue({ code: 'custom', path: issuePath, message: `icon name "${icon.name}" is not unique` });
            break;
          }
          names.add(icon.name);
        }
      })
      .describe('Icon sets'),
  },
  { message: 'invalid sprite record' },
);

const zEntryString = z.string({ message: 'must be a string' }).trim();
export const zEntries = z
  .union([zEntryString, z.array(zEntryString).min(1)])
  .transform((val) => (Array.isArray(val) ? val : [val]));
