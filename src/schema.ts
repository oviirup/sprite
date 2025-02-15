import { z } from 'zod';

export type SpriteConfig = {
  /** Entries for sprite record (path or glob pattern, relative to cwd) */
  entries: string | string[];
  /** Enable watch mode */
  watch?: boolean;
  /** Working directory (default: process.cwd()) */
  cwd?: string;
};

export type ResolvedConfig = {
  /** Entries for sprite record */
  entries: string[];
  /** Enable watch mode */
  watch: boolean;
  /** Working directory (default: process.cwd()) */
  cwd: string;
};

export const zIcon = z.object(
  {
    /** Name of the icon, (should be in lowercase) */
    name: z
      .string({ message: 'invalid name' })
      .regex(/^(?:[-a-z\d]*)$/, { message: 'invalid name, must be a kabab-case string' })
      .min(1, { message: '"name" is required' }),
    /** Inner content of the svg icon */
    content: z.string({ message: 'invalid content' }).min(1, { message: '"content" must not be empty' }),
    /** SVG attributes */
    attributes: z
      .record(z.coerce.string({ message: 'invalid attribute' }), { message: 'invalid attributes' })
      .default({})
      .optional(),
    /** Tags for the icon for search, (optional) */
    tags: z.array(z.string(), { message: 'invalid tags' }).default([]).optional(),
  },
  {
    message: 'invalid icon data',
  },
);

export type Icon = z.infer<typeof zIcon>;

export const zSpriteRecord = z.object(
  {
    /** Name of the sprite project */
    name: z.string({ message: 'invalid name' }).min(1, { message: '"name" is required' }),
    /** Prefix for icon names, with no empty-space (default: "") */
    prefix: z
      .string({ message: 'invalid prefix' })
      .regex(/[a-zA-Z\d]*/, { message: 'invalid prefix' })
      .default('')
      .optional(),
    /** Output sprite file, relative to cwd */
    output: z
      .string({ message: 'invalid output' })
      .regex(/\.svg$/, { message: 'output file must end with .svg extension' })
      .min(1, { message: '"output" is required' }),
    /** Output type definition file, relative to cwd */
    types: z
      .string({ message: 'invalid types' })
      .regex(/\.ts$/, { message: 'output file must end with .ts extension' })
      .optional(),
    /** Icon sets */
    icons: z
      .array(zIcon, { message: 'invalid icons' })
      .default([])
      .superRefine((icons, ctx) => {
        const names = new Set();
        icons.forEach((icon, index) => {
          if (names.has(icon.name)) {
            // Add an error for the current icon index
            ctx.addIssue({
              path: [index, 'name'],
              message: `icon name "${icon.name}" is not unique`,
              code: z.ZodIssueCode.custom,
            });
          } else {
            names.add(icon.name);
          }
        });
      }),
  },
  {
    message: 'invalid sprite record',
  },
);

export type SpriteRecord = z.infer<typeof zSpriteRecord>;
