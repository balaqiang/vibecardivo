import type { Palette, ThemeMeta } from './catalog/themes.js';
import { fontFaces } from './fonts.js';
import { githubAvatarUrl, loadAvatar, placeholderAvatar } from './image.js';
import { baseCss, splitBody, svgDocument } from './layout.js';
import { patternImage } from './patterns.js';
import { getTheme } from './themes/index.js';
import type { Avatar, CardOptions, RenderContext } from './types.js';
import { esc, luminance, mix, normalizeHex } from './utils.js';

const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

/** Readable foreground for a background colour. */
const onColor = (bg: string): string => (luminance(bg) > 0.45 ? '#111111' : '#ffffff');

/**
 * Applies the user's colour overrides on top of the theme palette. When only the background
 * changes and the theme's text would become unreadable, text colours flip automatically.
 */
export function resolvePalette(theme: ThemeMeta, colors: CardOptions['colors']): Palette {
  const p = { ...theme.palette };
  const bg =
    colors.background && colors.background !== 'transparent'
      ? normalizeHex(colors.background)?.slice(0, 7)
      : undefined;
  if (bg) {
    p.background = bg;
    p.surface = mix(bg, onColor(bg), 0.08);
    p.border = mix(bg, onColor(bg), 0.28);
    p.pattern = mix(bg, onColor(bg), 0.15);
    if (!colors.text && contrast(p.text, bg) < 3) {
      p.text = onColor(bg);
      p.muted = mix(p.text, bg, 0.35);
    }
    if (!colors.accent && contrast(p.accent, bg) < 2) p.accent = p.text;
  }
  if (colors.text) {
    p.text = colors.text.slice(0, 7);
    p.muted = mix(p.text, p.background, 0.35);
  }
  if (colors.accent) p.accent = colors.accent.slice(0, 7);
  return p;
}

async function resolveAvatar(opts: CardOptions, palette: Palette): Promise<Avatar | null> {
  if (opts.hideAvatar) return null;
  const github = opts.socials.find((s) => s.platform.id === 'github')?.handle;
  const url =
    opts.image ?? (github && /^[a-z\d-]{1,39}$/i.test(github) ? githubAvatarUrl(github) : null);
  const loaded = url ? await loadAvatar(url) : null;
  return loaded ?? placeholderAvatar(opts.name, palette.accent, onColor(palette.accent));
}

/** Builds the render context: palette, avatar, pattern and escaped text. */
export async function createContext(
  opts: CardOptions,
): Promise<{ ctx: RenderContext; theme: ReturnType<typeof getTheme> }> {
  const theme = getTheme(opts.theme);
  const palette = resolvePalette(theme, opts.colors);
  const avatar = await resolveAvatar(opts, palette);

  const patternId = opts.pattern === undefined ? theme.pattern : opts.pattern;
  const pattern = patternId
    ? {
        id: patternId,
        color: opts.patternColor?.slice(0, 7) ?? palette.pattern,
        opacity: opts.patternOpacity ?? theme.patternOpacity,
      }
    : null;

  const ctx: RenderContext = {
    opts,
    theme,
    palette,
    background: opts.colors.background === 'transparent' ? 'transparent' : palette.background,
    customBackground: opts.colors.background !== undefined,
    text: {
      name: esc(opts.name),
      description: esc(opts.description),
      role: esc(opts.role),
      location: esc(opts.location),
      site: esc(opts.site.replace(/^https?:\/\//i, '').replace(/\/$/, '')),
      skills: opts.skills.map(esc),
    },
    avatar,
    socials: opts.socials.slice(0, theme.maxSocials),
    shape: opts.avatarShape ?? theme.avatarShape,
    radius: opts.radius ?? theme.radius,
    animation: opts.animation === 'auto' ? theme.animation : opts.animation,
    pattern,
  };
  return { ctx, theme };
}

/** Renders a profile card to an SVG string. */
export async function renderCard(opts: CardOptions): Promise<string> {
  const { ctx, theme } = await createContext(opts);
  const image = ctx.pattern
    ? patternImage(ctx.pattern.id, ctx.pattern.color, ctx.pattern.opacity)
    : null;
  if (!image) ctx.pattern = null;

  const css = [
    fontFaces(theme.fonts),
    baseCss(ctx),
    image ? `.pattern{background-image:${image}}` : '',
    theme.css(ctx),
  ].join('\n');

  const body = theme.body ? theme.body(ctx) : splitBody(ctx);
  return svgDocument(ctx, body, css);
}

/** A friendly SVG explaining what went wrong, so a broken README image is still readable. */
export function renderErrorCard(message: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="980" height="245" viewBox="0 0 640 160" role="img" aria-label="Vibecard error">
<rect width="640" height="160" rx="16" fill="#fff5f5" stroke="#fecaca"/>
<text x="32" y="58" font-family="system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif" font-size="20" font-weight="700" fill="#991b1b">Vibecard couldn’t render this card</text>
<text x="32" y="90" font-family="system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif" font-size="14" fill="#7f1d1d">${esc(message)}</text>
<text x="32" y="122" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="12" fill="#b91c1c">Example: /api?name=Your%20Name&amp;theme=modern</text>
</svg>`;
}
