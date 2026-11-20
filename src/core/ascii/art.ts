import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

/** Dark → light density ramp. */
const RAMP = '@%#*+=-:. ';

interface Bitmap {
  width: number;
  height: number;
  /** RGBA, 4 bytes per pixel. */
  data: Uint8Array;
}

function decode(bytes: Uint8Array, mime: string): Bitmap | null {
  const buf = Buffer.from(bytes);
  try {
    if (mime === 'image/png' || buf.subarray(1, 4).toString('latin1') === 'PNG') {
      const png = PNG.sync.read(buf);
      return { width: png.width, height: png.height, data: png.data };
    }
    if (mime === 'image/jpeg' || (buf[0] === 0xff && buf[1] === 0xd8)) {
      const img = jpeg.decode(buf, {
        useTArray: true,
        maxMemoryUsageInMB: 64,
        maxResolutionInMP: 25,
      });
      return { width: img.width, height: img.height, data: img.data };
    }
  } catch {
    // Corrupt or unsupported image: fall through to `null`.
  }
  return null;
}

/**
 * Converts a PNG/JPEG avatar to ASCII art, `cols × rows` characters. The centre square of the
 * image is used and each cell is box-averaged. `darkBackground` flips the ramp so bright
 * pixels become dense characters. Returns `null` for formats we can't decode (GIF, WebP, SVG).
 */
export function imageToAscii(
  bytes: Uint8Array,
  mime: string,
  cols: number,
  rows: number,
  darkBackground = false,
): string[] | null {
  const img = decode(bytes, mime);
  if (!img?.width || !img.height) return null;

  const side = Math.min(img.width, img.height);
  const ox = Math.floor((img.width - side) / 2);
  const oy = Math.floor((img.height - side) / 2);
  const cw = side / cols;
  const ch = side / rows;

  const lum: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = Math.floor(ox + c * cw);
      const y0 = Math.floor(oy + r * ch);
      const x1 = Math.max(x0 + 1, Math.floor(ox + (c + 1) * cw));
      const y1 = Math.max(y0 + 1, Math.floor(oy + (r + 1) * ch));
      const step = Math.max(1, Math.floor((x1 - x0) / 6));
      let sum = 0;
      let n = 0;
      for (let y = y0; y < y1; y += step) {
        for (let x = x0; x < x1; x += step) {
          const i = (y * img.width + x) * 4;
          const a = (img.data[i + 3] ?? 255) / 255;
          const l =
            0.2126 * (img.data[i] ?? 0) +
            0.7152 * (img.data[i + 1] ?? 0) +
            0.0722 * (img.data[i + 2] ?? 0);
          sum += l * a + 255 * (1 - a);
          n++;
        }
      }
      lum.push(n ? sum / n : 255);
    }
  }

  // Stretch contrast so washed-out photos still produce a readable portrait.
  const min = Math.min(...lum);
  const range = Math.max(1, Math.max(...lum) - min);
  const ramp = darkBackground ? [...RAMP].reverse().join('') : RAMP;
  const out: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = '';
    for (let c = 0; c < cols; c++) {
      const t = ((lum[r * cols + c] ?? 255) - min) / range;
      line += ramp[Math.min(ramp.length - 1, Math.floor(t * ramp.length))];
    }
    out.push(line);
  }
  return out;
}
