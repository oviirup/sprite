import type { PluginConfig } from 'svgo';

export type SpriteConfig = {
  cwd?: string;
  input?: string;
  output?: string;
  prefix?: string;
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

export type ResolvedConfig = Required<SpriteConfig>;

export type IconData = {
  name: string;
  path: string;
  content: string;
};
