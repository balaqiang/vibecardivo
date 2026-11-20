import type { Avatar } from './types.js';
import { esc, initials } from './utils.js';

const MAX_BYTES = 3 * 1024 * 1024;
const TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_SIZE = 200;

interface CachedImage {
  bytes: Uint8Array;
  mime: string;
  expires: number;
}

/** Tiny LRU so repeated renders (and the builder's live preview) skip the network. */
const cache = new Map<string, CachedImage>();

export const clearImageCache = (): void => cache.clear();

const PRIVATE_HOST =
  /^(localhost|.*\.localhost|.*\.local|.*\.internal|0\.0\.0\.0|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+|\[?::1?\]?|\[?f[cd][0-9a-f]{2}:.*|\[?fe80:.*)$/i;

/** Rejects non-http(s) URLs and obvious private/loopback hosts (basic SSRF guard). */
export function isFetchableUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') && !PRIVATE_HOST.test(url.hostname)
    );
  } catch {
    return false;
  }
}

async function readLimited(res: Response): Promise<Uint8Array> {
  const declared = Number(res.headers.get('content-length') ?? 0);
  if (declared > MAX_BYTES) throw new Error('Image is too large');
  if (!res.body) return new Uint8Array(await res.arrayBuffer());

  const chunks: Uint8Array[] = [];
  let total = 0;
  const reader = res.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      throw new Error('Image is too large');
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

/** Downloads an image (with timeout, size cap and LRU cache). */
export async function fetchImage(url: string): Promise<{ bytes: Uint8Array; mime: string }> {
  const hit = cache.get(url);
  if (hit && hit.expires > Date.now()) {
    cache.delete(url);
    cache.set(url, hit);
    return hit;
  }
  if (!isFetchableUrl(url)) throw new Error('Image URL is not allowed');

  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8' },
  });
  if (!res.ok) throw new Error(`Image request failed (${res.status})`);
  const mime = (res.headers.get('content-type') ?? '').split(';')[0]?.trim() || 'image/png';
  if (!mime.startsWith('image/')) throw new Error('URL is not an image');

  const entry: CachedImage = {
    bytes: await readLimited(res),
    mime,
    expires: Date.now() + CACHE_TTL_MS,
  };
  cache.set(url, entry);
  if (cache.size > CACHE_SIZE) cache.delete(cache.keys().next().value as string);
  return entry;
}

export const githubAvatarUrl = (username: string): string =>
  `https://github.com/${encodeURIComponent(username.replace(/^@/, ''))}.png?size=256`;

/** Initials on a coloured square — used when no avatar is given or it fails to load. */
export function placeholderAvatar(name: string, background: string, foreground: string): Avatar {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="${background}"/><text x="60" y="62" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica,Arial,sans-serif" font-size="46" font-weight="700" fill="${foreground}">${esc(initials(name) || '?')}</text></svg>`;
  return {
    src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
    placeholder: true,
  };
}

/** Fetches the avatar and inlines it as a data URI (Camo blocks external images in SVGs). */
export async function loadAvatar(url: string): Promise<Avatar | null> {
  try {
    const { bytes, mime } = await fetchImage(url);
    return {
      src: `data:${mime};base64,${Buffer.from(bytes).toString('base64')}`,
      placeholder: false,
      bytes,
      mime,
    };
  } catch {
    return null;
  }
}
