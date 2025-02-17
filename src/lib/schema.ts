import { z } from 'zod';

export const zString = (params?: z.RawCreateParams) => z.coerce.string(params).trim();

export const zIcon = z.object(
  {
    /** Name of the icon, (should be in lowercase) */
    name: zString({ message: 'invalid name' })
      .regex(/^(?:[-a-z\d]*)$/, { message: 'invalid name, must be a kabab-case string' })
      .min(1, { message: '"name" is required' }),
    /** Inner content of the svg icon */
    content: zString({ message: 'invalid content' }).min(1, { message: '"content" must not be empty' }),
    /** SVG attributes */
    attributes: z.record(zString(), { message: 'invalid attributes' }).default({}).optional(),
    /** Tags for the icon for search, (optional) */
    tags: z.array(zString(), { message: 'invalid tags' }).default([]).optional(),
  },
  { message: 'invalid icon data' },
);

export const zSpriteRecord = z.object(
  {
    /** Name of the sprite project */
    name: zString({ message: 'invalid name' }).min(1, { message: '"name" is required' }),
    /** Prefix for icon names, with no empty-space (default: "") */
    prefix: zString({ message: 'invalid prefix' })
      .regex(/[a-zA-Z\d]*/, { message: 'invalid prefix' })
      .default('')
      .optional(),
    /** Output sprite file, relative to cwd */
    output: zString({ message: 'invalid output' })
      .regex(/\.svg$/, { message: 'output file must end with .svg extension' })
      .min(1, { message: '"output" is required' }),
    /** Output type definition file, relative to cwd */
    types: zString({ message: 'invalid types' })
      .regex(/\.ts$/, { message: 'output file must end with .ts extension' })
      .optional(),
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
      }),
  },
  { message: 'invalid sprite record' },
);
