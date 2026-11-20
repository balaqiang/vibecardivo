import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FONTS, type FontId, type FontSpec, family, fontFile } from './catalog/fonts.js';

export { FONTS, type FontId, family, fontFile };

const fontsDir = (): string =>
  process.env.VIBECARD_FONTS_DIR ?? join(process.cwd(), 'assets', 'fonts');

const base64Cache = new Map<FontId, string>();

function loadBase64(id: FontId): string {
  let data = base64Cache.get(id);
  if (!data) {
    data = readFileSync(join(fontsDir(), fontFile(id))).toString('base64');
    base64Cache.set(id, data);
  }
  return data;
}

/** `@font-face` rules for the given fonts, each family prefixed with `cv-` to avoid clashes. */
export function fontFaces(ids: readonly FontId[]): string {
  return [...new Set(ids)]
    .map((id) => {
      const f: FontSpec = FONTS[id];
      return `@font-face{font-family:'cv-${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:block;src:url(data:font/woff2;base64,${loadBase64(id)}) format('woff2')}`;
    })
    .join('');
}
