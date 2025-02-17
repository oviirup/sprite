import { zIcon, zSpriteRecord } from '@/lib/schema';
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

export type Icon = z.infer<typeof zIcon>;

export type SpriteRecord = z.infer<typeof zSpriteRecord>;
