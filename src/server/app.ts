import { Hono } from 'hono';
import { etag } from 'hono/etag';
import { CUSTOM_PATTERNS, HERO_PATTERNS } from '../core/catalog/patterns.js';
import { PLATFORMS } from '../core/catalog/platforms.js';
import { THEMES } from '../core/catalog/themes.js';
import { parseCardParams } from '../core/params.js';
import { renderCard, renderErrorCard } from '../core/render.js';

const VERSION = '2.0.0';

/** Cards are deterministic for a given URL, so let CDNs (and GitHub's Camo) cache them. */
const CACHE_OK = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';
const CACHE_ERROR = 'no-store';

/** Locks down SVGs opened directly in a browser tab: no scripts, only inline styles and data URIs. */
const SVG_CSP = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:";

export const app = new Hono();

app.use('/api/*', etag());

async function card(c: import('hono').Context) {
  const result = parseCardParams(new URL(c.req.url).searchParams);
  let svg: string;
  let cache = CACHE_OK;
  if (result.ok) {
    try {
      svg = await renderCard(result.options);
    } catch (error) {
      console.error('[vibecard] render failed', error);
      svg = renderErrorCard('Something went wrong while rendering. Please try again.');
      cache = CACHE_ERROR;
    }
  } else {
    svg = renderErrorCard(result.error);
    cache = CACHE_ERROR;
  }
  return c.body(svg, 200, {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': cache,
    'Content-Security-Policy': SVG_CSP,
    'X-Content-Type-Options': 'nosniff',
  });
}

app.get('/api', card);
app.get('/api/card', card);
app.get('/api/card.svg', card);

app.get('/api/themes', (c) =>
  c.json(
    THEMES.map(
      ({ id, name, description, tags, palette, pattern, avatarShape, radius, animation }) => ({
        id,
        name,
        description,
        tags,
        palette,
        pattern,
        avatarShape,
        radius,
        animation,
      }),
    ),
  ),
);

app.get('/api/platforms', (c) =>
  c.json(
    PLATFORMS.map(({ id, label, placeholder, aliases }) => ({
      id,
      label,
      placeholder,
      aliases: aliases ?? [],
    })),
  ),
);

app.get('/api/patterns', (c) => c.json({ hero: HERO_PATTERNS, custom: CUSTOM_PATTERNS }));

app.get('/api/health', (c) => c.json({ ok: true, version: VERSION }));

app.notFound((c) =>
  c.req.path.startsWith('/api') ? c.json({ error: 'Not found' }, 404) : c.text('Not found', 404),
);

export default app;
