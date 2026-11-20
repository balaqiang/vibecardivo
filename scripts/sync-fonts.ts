/**
 * Copies the latin-subset woff2 files every theme needs from the installed `@fontsource/*`
 * packages into `assets/fonts`. Run with `pnpm fonts:sync` after adding a font to FONTS.
 */
import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { FONTS, type FontId, fontFile } from '../src/core/catalog/fonts.js';

const root = join(import.meta.dirname, '..');
const outDir = join(root, 'assets', 'fonts');
mkdirSync(outDir, { recursive: true });

const wanted = new Set((Object.keys(FONTS) as FontId[]).map(fontFile));
for (const file of readdirSync(outDir)) {
  if (file.endsWith('.woff2') && !wanted.has(file)) rmSync(join(outDir, file));
}

for (const id of Object.keys(FONTS) as FontId[]) {
  const pkgDir = join(root, 'node_modules', '@fontsource', FONTS[id].pkg);
  const file = fontFile(id);
  copyFileSync(join(pkgDir, 'files', file), join(outDir, file));
  console.log(`✓ ${file}`);
}
