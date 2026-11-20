import { defineConfig } from 'vite';

/** Bundles the self-hosting Node server (`src/server/node.ts`) into `dist-server/`. */
export default defineConfig({
  build: {
    ssr: 'src/server/node.ts',
    outDir: 'dist-server',
    emptyOutDir: true,
    target: 'node22',
    rollupOptions: { output: { entryFileNames: 'node.js' } },
  },
});
