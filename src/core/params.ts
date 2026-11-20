import { z } from 'zod';
import { LIMITS } from './catalog/limits.js';
import { findPattern } from './catalog/patterns.js';
import { platformForParam } from './catalog/platforms.js';
import { ANIMATIONS, AVATAR_SHAPES, DEFAULT_THEME, THEME_IDS } from './catalog/themes.js';
import type { CardOptions, SocialLink } from './types.js';
import { clamp, clean, clip, normalizeHex } from './utils.js';

export { LIMITS };

const text = (max: number) =>
  z
    .string()
    .transform((v) => clip(clean(v), max))
    .optional()
    .transform((v) => v ?? '');

/** Hex colour (with or without `#`), or `transparent`. Invalid values fall back to the theme. */
const color = z
  .string()
  .transform((v) => (v.trim().toLowerCase() === 'transparent' ? 'transparent' : normalizeHex(v)))
  .optional()
  .catch(undefined);

const flag = z
  .string()
  .transform((v) => ['true', '1', 'yes', 'on', ''].includes(v.trim().toLowerCase()))
  .optional()
  .catch(undefined);

const number = (min: number, max: number) =>
  z.coerce
    .number()
    .refine(Number.isFinite)
    .transform((n) => clamp(n, min, max))
    .optional()
    .catch(undefined);

const lower = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase() : v);

const httpUrl = (v: string): string | null => {
  try {
    const url = new URL(v.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
};

const schema = z.object({
  name: z
    .string({ error: 'The `name` parameter is required.' })
    .transform((v) => clip(clean(v), LIMITS.name))
    .refine((v) => v.length > 0, 'The `name` parameter is required.'),
  description: text(LIMITS.description),
  role: text(LIMITS.role),
  location: text(LIMITS.location),
  site: text(LIMITS.site),
  image: z.string().optional(),
  theme: z.preprocess(lower, z.enum(THEME_IDS)).optional().catch(undefined),
  backgroundColor: color,
  fontColor: color,
  iconColor: color,
  colorPattern: color,
  pattern: z.string().optional(),
  opacity: number(0, 1),
  skills: z.string().optional(),
  avatarShape: z.preprocess(lower, z.enum(AVATAR_SHAPES)).optional().catch(undefined),
  radius: number(0, 48),
  animation: z.preprocess(lower, z.enum(ANIMATIONS)).optional().catch(undefined),
  disableAnimation: flag,
  hideAvatar: flag,
});

/** Strips the scheme/host when a full profile URL is pasted instead of a handle. */
export function normalizeHandle(raw: string, hosts: readonly string[] = []): string {
  let value = clean(raw);
  const bare = value.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  for (const host of hosts) {
    if (bare.toLowerCase().startsWith(`${host}/`)) {
      value = bare.slice(host.length + 1).replace(/[/?#].*$/, '');
      break;
    }
  }
  return clip(value, LIMITS.handle);
}

/** Social links in the order they appear in the URL, de-duplicated by platform. */
function parseSocials(params: URLSearchParams): SocialLink[] {
  const seen = new Set<string>();
  const links: SocialLink[] = [];
  for (const [key, value] of params) {
    const platform = platformForParam(key);
    if (!platform || seen.has(platform.id)) continue;
    const handle = normalizeHandle(value, platform.hosts);
    if (!handle) continue;
    seen.add(platform.id);
    links.push({ platform, handle });
  }
  return links;
}

export type ParseResult = { ok: true; options: CardOptions } | { ok: false; error: string };

/**
 * Parses card options from a query string. Every parameter of the original Cardivo API is
 * still accepted (`name`, `description`, `image`, `backgroundColor`, `iconColor`, `fontColor`,
 * `site`, `pattern`, `colorPattern`, `opacity`, `instagram`, `linkedin`, `github`, `twitter`,
 * `disableAnimation`). Invalid optional values fall back to theme defaults instead of failing,
 * so a typo never breaks someone's README.
 */
export function parseCardParams(params: URLSearchParams): ParseResult {
  const raw: Record<string, string> = {};
  for (const [key, value] of params) if (!(key in raw)) raw[key] = value;

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid parameters.' };
  }
  const q = parsed.data;

  const imageRaw = q.image?.trim() ?? '';
  const hideAvatar = q.hideAvatar === true || imageRaw.toLowerCase() === 'none';

  let pattern: string | null | undefined;
  if (q.pattern !== undefined) {
    const value = q.pattern.trim().toLowerCase();
    pattern = value === '' || value === 'none' ? null : (findPattern(value) ?? undefined);
  }

  const skills = (q.skills ?? '')
    .split(',')
    .map((s) => clip(clean(s), LIMITS.skill))
    .filter(Boolean)
    .slice(0, LIMITS.skills);

  return {
    ok: true,
    options: {
      name: q.name,
      description: q.description,
      role: q.role,
      location: q.location,
      site: q.site,
      image: imageRaw && !hideAvatar ? httpUrl(imageRaw) : null,
      hideAvatar,
      theme: q.theme ?? DEFAULT_THEME,
      colors: {
        ...(q.backgroundColor && { background: q.backgroundColor }),
        ...(q.fontColor && q.fontColor !== 'transparent' && { text: q.fontColor }),
        ...(q.iconColor && q.iconColor !== 'transparent' && { accent: q.iconColor }),
      },
      pattern,
      ...(q.colorPattern && q.colorPattern !== 'transparent' && { patternColor: q.colorPattern }),
      ...(q.opacity !== undefined && { patternOpacity: q.opacity }),
      skills,
      socials: parseSocials(params).slice(0, LIMITS.socials),
      ...(q.avatarShape && { avatarShape: q.avatarShape }),
      ...(q.radius !== undefined && { radius: q.radius }),
      animation: q.disableAnimation ? 'none' : (q.animation ?? 'auto'),
    },
  };
}
