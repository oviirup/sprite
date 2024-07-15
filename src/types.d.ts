import type { PluginConfig } from 'svgo';

export type SpriteConfig = {
  cwd?: string;
  input?: string;
  output?: string;
  prefix?: string;
  /** Specify the suffix for output files */
  outputFileSuffix?: {
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

export type ResolvedConfig = Predefined<SpriteConfig>;

export type IconData = {
  name: string;
  path: string;
  content: string;
};
