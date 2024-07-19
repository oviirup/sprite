import type { PluginConfig } from 'svgo';

export type Entries = Record<string, string> | string[];

export type ResolvedEntries = { input: string; output: string }[];

export type SpriteConfig = {
  cwd?: string;
  entries: Entries;
  iconPrefix?: string;
  /** Specify the suffix for output files */
  outFileSuffix?: {
    sprite?: string;
    meta?: string;
  };
  /** Clear out output files */
  clear?: boolean;
  /** Enable watch mode */
  watch?: boolean;
  /**
   * Add custom svgo plugin. Read the official documentation for more details
   *
   * @since 0.0.4
   * @see https://svgo.dev/docs/plugins/
   */
  svgoPlugins?: PluginConfig[];
};

type Predefined<T> = Required<{
  [P in keyof T]: T[P] extends object | undefined
    ? Predefined<Required<T[P]>>
    : T[P];
}>;

export type ResolvedConfig = Predefined<Omit<SpriteConfig, 'entries'>> & {
  entries: ResolvedEntries;
};

export type IconData = {
  name: string;
  path: string;
  content: string;
};
