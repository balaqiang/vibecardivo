import { XMLValidator } from 'fast-xml-parser';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { THEMES } from '../src/core/catalog/themes.js';
import { clearImageCache } from '../src/core/image.js';
import { parseCardParams } from '../src/core/params.js';
import { renderCard, renderErrorCard, resolvePalette } from '../src/core/render.js';
import { mockImageFetch } from './helpers.js';

const FULL =
  'name=Balaqiang&role=Creative%20Developer&description=Building%20delightful%20things%20%26%20tiny%20tools%20%E2%9C%A8&location=Bali&site=https://balaqiang.dev&github=octocat&x=balaqiang&linkedin=Bala&instagram=bq&skills=TypeScript,Svelte,Rust';

async function render(qs: string) {
  const parsed = parseCardParams(new URLSearchParams(qs));
  if (!parsed.ok) throw new Error(parsed.error);
  return renderCard(parsed.options);
}

beforeEach(() => clearImageCache());
afterEach(() => vi.unstubAllGlobals());

describe.each(THEMES.map((t) => t.id))('theme %s', (theme) => {
  test('renders well-formed SVG with the profile content', async () => {
    mockImageFetch();
    const svg = await render(`${FULL}&theme=${theme}`);
    expect(XMLValidator.validate(svg)).toBe(true);
    expect(svg).toContain('Balaqiang');
    // The ascii theme draws the avatar as text art instead of embedding the photo.
    if (theme !== 'ascii') expect(svg).toContain('data:image/png;base64,');
    expect(svg).toContain('data:font/woff2;base64,');
    // Camo blocks external requests: nothing may point off-card except XML namespaces.
    const external = svg.match(/(?:src|href)=["']https?:/g);
    expect(external).toBeNull();
  });

  test('survives minimal input, no avatar and every animation', async () => {
    for (const animation of ['none', 'slide', 'fade', 'pop', 'type']) {
      const svg = await render(`name=X&theme=${theme}&hideAvatar=true&animation=${animation}`);
      expect(XMLValidator.validate(svg)).toBe(true);
    }
  });
});

describe('renderCard', () => {
  test('escapes user content (no markup injection)', async () => {
    mockImageFetch();
    for (const theme of THEMES.map((t) => t.id)) {
      const svg = await render(
        `name=%3Cscript%3Ealert(1)%3C/script%3E&description=%22%3E%3Cimg%20onerror%3Dx%3E&github=a%3Cb&theme=${theme}`,
      );
      expect(XMLValidator.validate(svg)).toBe(true);
      expect(svg).not.toContain('<script');
      expect(svg).not.toContain('<img onerror');
    }
  });

  test('uses the GitHub avatar when no image is given', async () => {
    const { urls } = mockImageFetch();
    await render('name=A&github=octocat');
    expect(urls).toEqual(['https://github.com/octocat.png?size=256']);
  });

  test('caches avatars between renders', async () => {
    const { fn } = mockImageFetch();
    await render('name=A&image=https://example.com/a.png');
    await render('name=B&image=https://example.com/a.png&theme=modern');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('falls back to an initials placeholder when the image fails', async () => {
    mockImageFetch(404);
    const svg = await render('name=Satya%20Wikananda&image=https://example.com/missing.png');
    expect(svg).toContain('data:image/svg+xml;base64,');
    const placeholder = svg.match(/data:image\/svg\+xml;base64,([^"]+)/)?.[1] ?? '';
    expect(Buffer.from(placeholder, 'base64').toString()).toContain('>SW<');
  });

  test('refuses to fetch private hosts', async () => {
    const { fn } = mockImageFetch();
    await render('name=A&image=http://127.0.0.1:8080/secret.png');
    await render('name=A&image=http://localhost/secret.png');
    expect(fn).not.toHaveBeenCalled();
  });

  test('ascii theme turns the avatar into text art', async () => {
    mockImageFetch();
    const svg = await render('name=Bala&theme=ascii&image=https://example.com/a.png');
    expect(svg).not.toContain('data:image/png;base64,');
    expect(svg).toMatch(/class="art">[ .:\-=+*#%@]+</);
  });

  test('applies the classic pattern and colours from the original API', async () => {
    const svg = await render(
      'name=A&hideAvatar=1&pattern=leaf&colorPattern=%23ff0000&backgroundColor=%23123456',
    );
    expect(svg).toContain('--bg:#123456');
    expect(svg).toContain('.pattern{background-image:url(');
    expect(svg).toMatch(/ff0000/i);
  });

  test('keeps the original 980×490 output size', async () => {
    const svg = await render('name=A&hideAvatar=1');
    expect(svg).toContain('width="980" height="490" viewBox="0 0 640 320"');
  });
});

describe('resolvePalette', () => {
  const classic = THEMES.find((t) => t.id === 'classic')!;

  test('flips unreadable text when only the background changes', () => {
    const p = resolvePalette(classic, { background: '#000000' });
    expect(p.background).toBe('#000000');
    expect(p.text).toBe('#ffffff');
  });

  test('respects explicit text colours', () => {
    const p = resolvePalette(classic, { background: '#000000', text: '#111111' });
    expect(p.text).toBe('#111111');
  });
});

describe('renderErrorCard', () => {
  test('is valid XML and escapes the message', () => {
    const svg = renderErrorCard('bad <input> & stuff');
    expect(XMLValidator.validate(svg)).toBe(true);
    expect(svg).toContain('bad &lt;input&gt; &amp; stuff');
  });
});
