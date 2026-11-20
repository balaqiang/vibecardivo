import { fileURLToPath } from 'node:url';
import devServer from '@hono/vite-dev-server';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

const path = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: 'web',
  publicDir: 'public',
  resolve: { alias: { '@core': path('./src/core') } },
  plugins: [
    svelte(),
    // In development the Hono API runs inside Vite, so `pnpm dev` serves builder + /api together.
    devServer({
      entry: path('./src/server/app.ts'),
      exclude: [/^(?!\/api(?:[/?]|$)).*/],
      injectClientScript: false,
    }),
  ],
  build: { outDir: '../dist', emptyOutDir: true, target: 'es2022' },
  server: { port: 5173 },
});
