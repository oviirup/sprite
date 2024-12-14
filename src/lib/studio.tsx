import { SpriteConfig } from '@/schema';
import { Layout } from '@/studio/layout';
import { logger } from '@/utils/logger';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { Hono } from 'hono/quick';
import pi from 'picocolors';

type StudioOptions = Partial<SpriteConfig> & {
  host?: string;
  port?: number;
};

export function studio({ host, port, ...config }: StudioOptions = {}) {
  // const cfg = resolveConfig(config);
  const serverHost = host ?? '127.0.0.1';
  const serverPort = port ?? 2020;

  logger.log(pi.dim, pi.dim('initiating ...'));

  const app = new Hono();
  app.use(async (ctx, next) => {
    // allow access to private networks
    // 🔗 https://wicg.github.io/private-network-access/#headers
    ctx.header('Access-Control-Allow-Private-Network', 'true');
    return cors()(ctx, next);
  });

  app.onError((err, ctx) => {
    logger.error('something went wrong');
    console.error(err);
    return ctx.json({ status: 'error', error: err.message });
  });

  app.all('/', (c) => {
    return c.html(<Layout>Hello world</Layout>);
  });

  const listener = serve({ fetch: app.fetch, port: serverPort, hostname: serverHost }, (info) => {
    if (!info) return;
    const hostname = info.address === '127.0.0.1' ? 'localhost' : info.address;
    const url = `http://${hostname}:${info.port}`;
    logger.success(`ready - ${pi.dim(url)}`);
  });

  listener.on('close', () => {
    logger.warn('closing studio ...');
  });

  // exit process on termination
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL']) {
    process.on(signal, () => {
      listener.close();
      return;
    });
  }
}
