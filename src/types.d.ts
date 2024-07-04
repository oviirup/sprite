export type SpriteConfig = {
  cwd?: string;
  input?: string;
  output?: string;
  prefix?: string;
  clear?: boolean;
  watch?: boolean;
};

export type ResolvedConfig = Required<SpriteConfig>;

export type IconData = {
  name: string;
  path: string;
  content: string;
};
