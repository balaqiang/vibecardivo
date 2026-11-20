// Pure font registry (no Node APIs) so the web builder can import theme metadata too.

/**
 * Every font a theme can embed. Files live in `assets/fonts` (latin subset, woff2) and are
 * copied from Fontsource by `pnpm fonts:sync`. Fonts are inlined as base64 because GitHub
 * proxies README images through Camo, which blocks external requests from inside an SVG.
 */
export const FONTS = {
  'montserrat-400': { family: 'Montserrat', weight: 400, style: 'normal', pkg: 'montserrat' },
  'montserrat-700': { family: 'Montserrat', weight: 700, style: 'normal', pkg: 'montserrat' },
  'inter-400': { family: 'Inter', weight: 400, style: 'normal', pkg: 'inter' },
  'inter-600': { family: 'Inter', weight: 600, style: 'normal', pkg: 'inter' },
  'inter-800': { family: 'Inter', weight: 800, style: 'normal', pkg: 'inter' },
  'jetbrains-mono-400': {
    family: 'JetBrains Mono',
    weight: 400,
    style: 'normal',
    pkg: 'jetbrains-mono',
  },
  'jetbrains-mono-700': {
    family: 'JetBrains Mono',
    weight: 700,
    style: 'normal',
    pkg: 'jetbrains-mono',
  },
  'quicksand-500': { family: 'Quicksand', weight: 500, style: 'normal', pkg: 'quicksand' },
  'quicksand-700': { family: 'Quicksand', weight: 700, style: 'normal', pkg: 'quicksand' },
  'orbitron-500': { family: 'Orbitron', weight: 500, style: 'normal', pkg: 'orbitron' },
  'orbitron-900': { family: 'Orbitron', weight: 900, style: 'normal', pkg: 'orbitron' },
  'press-start-2p-400': {
    family: 'Press Start 2P',
    weight: 400,
    style: 'normal',
    pkg: 'press-start-2p',
  },
  'vt323-400': { family: 'VT323', weight: 400, style: 'normal', pkg: 'vt323' },
  'space-grotesk-500': {
    family: 'Space Grotesk',
    weight: 500,
    style: 'normal',
    pkg: 'space-grotesk',
  },
  'space-grotesk-700': {
    family: 'Space Grotesk',
    weight: 700,
    style: 'normal',
    pkg: 'space-grotesk',
  },
  'playfair-display-900': {
    family: 'Playfair Display',
    weight: 900,
    style: 'normal',
    pkg: 'playfair-display',
  },
  'playfair-display-400i': {
    family: 'Playfair Display',
    weight: 400,
    style: 'italic',
    pkg: 'playfair-display',
  },
  'lora-400': { family: 'Lora', weight: 400, style: 'normal', pkg: 'lora' },
} as const satisfies Record<string, FontSpec>;

export interface FontSpec {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  /** Fontsource package name (without the `@fontsource/` scope). */
  pkg: string;
}

export type FontId = keyof typeof FONTS;

/** File name inside `assets/fonts`, mirroring Fontsource's naming. */
export const fontFile = (id: FontId): string => {
  const f: FontSpec = FONTS[id];
  return `${f.pkg}-latin-${f.weight}-${f.style}.woff2`;
};

/** CSS `font-family` value for a family embedded by the renderer (prefixed with `cv-`). */
export const family = (name: string, fallback = 'sans-serif'): string => `'cv-${name}',${fallback}`;
