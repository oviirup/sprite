import { SpriteConfig } from '@/types';
import { resolveConfig } from '@/utils/config';

export async function extract(opts: SpriteConfig) {
  const config = await resolveConfig({ ...opts, watch: false, clear: false });
  console.log(config);
}
