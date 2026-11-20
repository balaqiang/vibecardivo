/**
 * Self-hosting entry: serves the API and the built web builder from one Node process.
 *   pnpm build && pnpm build:server && pnpm start
 */
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { app as api } from './app.js';

const server = new Hono();
server.use('*', compress());
server.route('/', api);
// Mounted sub-apps don't run their own notFound handler, so unknown API routes 404 here.
server.all('/api/*', (c) => c.json({ error: 'Not found' }, 404));
server.use('/*', serveStatic({ root: './dist' }));
server.get('*', serveStatic({ path: './dist/index.html' }));

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: server.fetch, port }, (info) => {
  console.log(`Vibecard running on http://localhost:${info.port}`);
});
