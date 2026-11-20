import jpeg from 'jpeg-js';
import { describe, expect, test } from 'vitest';
import { imageToAscii } from '../src/core/ascii/art.js';
import { banner } from '../src/core/ascii/figlet.js';
import { PLATFORMS } from '../src/core/catalog/platforms.js';
import { parseCardParams } from '../src/core/params.js';
import { cardUrl, fromQuery, toQuery } from '../src/core/query.js';
import { clip, esc, fitSize, initials, normalizeHex, toAscii, wrap } from '../src/core/utils.js';
import { samplePng } from './helpers.js';

describe('utils', () => {
  test('esc', () =>
    expect(esc(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    ));
  test('clip never splits emoji', () => expect(clip('ab😀cd', 4)).toBe('ab😀…'));
  test('normalizeHex', () => {
    expect(normalizeHex('ABC')).toBe('#aabbcc');
    expect(normalizeHex('#11223344')).toBe('#11223344');
    expect(normalizeHex('blue')).toBeUndefined();
  });
  test('wrap', () => {
    expect(wrap('the quick brown fox jumps', 10)).toEqual(['the quick', 'brown fox', 'jumps']);
    expect(wrap('the quick brown fox jumps', 10, 2)).toEqual(['the quick', 'brown f...']);
  });
  test('toAscii', () => expect(toAscii('Café — “hi” ✨')).toBe('Cafe - "hi"'));
  test('initials', () => {
    expect(initials('Satya Wikananda')).toBe('SW');
    expect(initials('balaqiang')).toBe('BA');
  });
  test('fitSize shrinks long text', () => {
    expect(fitSize('short', 32, 20)).toBe(32);
    expect(fitSize('x'.repeat(40), 32, 20)).toBe(16);
  });
});

describe('ascii helpers', () => {
  test('banner picks a font that fits', () => {
    const rows = banner('Bala', 40);
    expect(rows).not.toBeNull();
    expect(Math.max(...(rows ?? []).map((r) => r.length))).toBeLessThanOrEqual(40);
    expect(banner('A very long name that will never fit', 20)).toBeNull();
  });

  test('imageToAscii maps a gradient left (dark) to right (light)', () => {
    const art = imageToAscii(new Uint8Array(samplePng(32)), 'image/png', 10, 2);
    expect(art).toHaveLength(2);
    expect(art?.[0]?.[0]).toBe('@');
    expect(art?.[0]?.[9]).toBe(' ');
    expect(imageToAscii(new Uint8Array([1, 2, 3]), 'image/gif', 10, 2)).toBeNull();
  });

  test('imageToAscii decodes JPEG avatars (GitHub serves both)', () => {
    const size = 64;
    const data = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const v = Math.hypot(x - 32, y - 32) < 20 ? 20 : 235; // dark disc on light ground
        data.fill(v, (y * size + x) * 4, (y * size + x) * 4 + 3);
        data[(y * size + x) * 4 + 3] = 255;
      }
    }
    const jpg = jpeg.encode({ data, width: size, height: size }, 90).data;
    const art = imageToAscii(new Uint8Array(jpg), 'image/jpeg', 20, 8);
    expect(art?.[4]?.[10]).toBe('@');
    expect(art?.[0]?.[0]).toBe(' ');
  });
});

describe('query builder', () => {
  const input = {
    name: 'Bala Qiang',
    role: 'Dev',
    theme: 'ascii',
    socials: [['github', 'bq'] as const, ['x', 'bq_x'] as const],
    skills: ['TS', 'Svelte'],
    radius: 12,
    animation: 'auto',
    pattern: 'none',
    opacity: 0.5,
  };

  test('skips empty and default values', () => {
    const qs = toQuery(input).toString();
    expect(qs).toBe(
      'name=Bala+Qiang&role=Dev&theme=ascii&github=bq&x=bq_x&skills=TS%2CSvelte&pattern=none&radius=12',
    );
    expect(toQuery({ name: 'A', theme: 'classic' }).toString()).toBe('name=A');
  });

  test('round-trips through the parser and fromQuery', () => {
    const params = toQuery(input);
    const parsed = parseCardParams(params);
    expect(parsed.ok && parsed.options.socials.map((s) => s.handle)).toEqual(['bq', 'bq_x']);
    const back = fromQuery(
      params,
      PLATFORMS.map((p) => p.id),
    );
    expect(back.socials).toEqual([
      ['github', 'bq'],
      ['x', 'bq_x'],
    ]);
    expect(back.skills).toEqual(['TS', 'Svelte']);
    expect(back.radius).toBe(12);
  });

  test('cardUrl', () => {
    expect(cardUrl('https://cards.dev/', { name: 'A' })).toBe('https://cards.dev/api?name=A');
  });
});
