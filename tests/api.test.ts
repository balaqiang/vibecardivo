import { afterEach, describe, expect, test, vi } from 'vitest';
import { clearImageCache } from '../src/core/image.js';
import { app } from '../src/server/app.js';
import { mockImageFetch } from './helpers.js';

afterEach(() => {
  vi.unstubAllGlobals();
  clearImageCache();
});

describe('GET /api', () => {
  test('returns a cacheable SVG card', async () => {
    mockImageFetch();
    const res = await app.request('/api?name=Balaqiang&github=octocat&theme=lofi');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/svg+xml; charset=utf-8');
    expect(res.headers.get('cache-control')).toContain('s-maxage=86400');
    expect(res.headers.get('content-security-policy')).toContain("default-src 'none'");
    expect(res.headers.get('etag')).toBeTruthy();
    expect(await res.text()).toContain('<svg');
  });

  test('answers 304 for a matching ETag', async () => {
    const url = '/api?name=A&hideAvatar=1';
    const first = await app.request(url);
    const etag = first.headers.get('etag') ?? '';
    const second = await app.request(url, { headers: { 'If-None-Match': etag } });
    expect(second.status).toBe(304);
  });

  test('renders a readable error card when name is missing', async () => {
    const res = await app.request('/api?description=hello');
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.text()).toContain('The `name` parameter is required.');
  });

  test('also serves /api/card.svg', async () => {
    const res = await app.request('/api/card.svg?name=A&hideAvatar=1');
    expect(res.status).toBe(200);
  });
});

describe('metadata endpoints', () => {
  test('/api/themes lists every theme', async () => {
    const themes = (await (await app.request('/api/themes')).json()) as Array<{ id: string }>;
    expect(themes.map((t) => t.id)).toEqual([
      'classic',
      'modern',
      'aurora',
      'minimal',
      'hacker',
      'ascii',
      'lofi',
      'synthwave',
      'pixel',
      'brutalist',
      'editorial',
      'dracula',
      'nord',
      'cyberpunk',
      'cartoon',
      'retro',
      'neon',
      'blueprint',
      'notebook',
      'ticket',
    ]);
  });

  test('/api/platforms and /api/patterns', async () => {
    const platforms = (await (await app.request('/api/platforms')).json()) as unknown[];
    expect(platforms.length).toBeGreaterThanOrEqual(38);
    const patterns = (await (await app.request('/api/patterns')).json()) as { hero: string[] };
    expect(patterns.hero).toHaveLength(87);
  });

  test('/api/health and unknown routes', async () => {
    expect(await (await app.request('/api/health')).json()).toMatchObject({ ok: true });
    expect((await app.request('/api/nope')).status).toBe(404);
  });
});
