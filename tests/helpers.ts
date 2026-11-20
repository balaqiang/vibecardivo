import { PNG } from 'pngjs';
import { vi } from 'vitest';

/** A small gradient PNG, so tests never touch the network. */
export function samplePng(size = 16): Buffer {
  const png = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const v = Math.round((x / (size - 1)) * 255);
      png.data[i] = v;
      png.data[i + 1] = v;
      png.data[i + 2] = v;
      png.data[i + 3] = 255;
    }
  }
  return PNG.sync.write(png);
}

/** Stubs global fetch to serve `samplePng()` and records requested URLs. */
export function mockImageFetch(status = 200) {
  const urls: string[] = [];
  const fn = vi.fn(async (input: string | URL | Request) => {
    urls.push(String(input instanceof Request ? input.url : input));
    if (status !== 200) return new Response('nope', { status });
    return new Response(new Uint8Array(samplePng()), { headers: { 'content-type': 'image/png' } });
  });
  vi.stubGlobal('fetch', fn);
  return { fn, urls };
}
