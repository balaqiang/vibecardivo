/** Escapes text for use inside XML/XHTML content and attribute values. */
export const esc = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const xmlSafe = (ch: string): boolean => {
  const c = ch.codePointAt(0) ?? 0;
  return (
    c === 0x9 || c === 0xa || c === 0xd || (c >= 0x20 && c !== 0x7f && c !== 0xfffe && c !== 0xffff)
  );
};

/** Removes characters that are invalid in XML (control chars) and collapses whitespace. */
export const clean = (value: string): string =>
  Array.from(value).filter(xmlSafe).join('').replace(/\s+/g, ' ').trim();

/** Truncates by code point (never splits an emoji) and adds an ellipsis. */
export const clip = (value: string, max: number): string => {
  const chars = [...value];
  return chars.length <= max
    ? value
    : `${chars
        .slice(0, Math.max(0, max - 1))
        .join('')
        .trimEnd()}…`;
};

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, n));

/** Font size that shrinks long single-line text instead of overflowing. */
export const fitSize = (text: string, base: number, maxChars: number, min = 0.5): number => {
  const len = [...text].length;
  return len <= maxChars
    ? base
    : Math.round(Math.max(base * min, (base * maxChars) / len) * 10) / 10;
};

/** Greedy word wrap for monospace layouts. Long words are hard-split. */
export function wrap(text: string, width: number, maxLines = Number.POSITIVE_INFINITY): string[] {
  const lines: string[] = [];
  let line = '';
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    let word = raw;
    while (word.length > width) {
      if (line) {
        lines.push(line);
        line = '';
      }
      lines.push(word.slice(0, width));
      word = word.slice(width);
    }
    if (!line) line = word;
    else if (line.length + 1 + word.length <= width) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    const last = kept[maxLines - 1] ?? '';
    kept[maxLines - 1] = `${last.slice(0, Math.max(0, width - 3)).trimEnd()}...`;
    return kept;
  }
  return lines;
}

/** Folds accents and drops anything outside printable ASCII (for text-mode themes). */
export const toAscii = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Initials for avatar placeholders: "Satya Wikananda" → "SW", "balaqiang" → "BA". */
export const initials = (name: string): string => {
  const words = name.split(/\s+/).filter(Boolean);
  const first = [...(words[0] ?? '')];
  const last = [...(words[words.length - 1] ?? '')];
  const letters = words.length > 1 ? [first[0], last[0]] : first.slice(0, 2);
  return letters.join('').toUpperCase();
};

/* ----------------------------------------------------------------- colours */

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Normalises `fff`, `#FFF`, `ffffff80`… to lowercase `#rrggbb` / `#rrggbbaa`; `undefined` if invalid. */
export function normalizeHex(value: string | undefined | null): string | undefined {
  const m = value?.trim().match(HEX);
  if (!m?.[1]) return undefined;
  const h = m[1].toLowerCase();
  return `#${h.length <= 4 ? [...h].map((c) => c + c).join('') : h}`;
}

const rgb = (hex: string): [number, number, number] => {
  const h = (normalizeHex(hex) ?? '#000000').slice(1, 7);
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
};

const toHex = (c: number[]): string =>
  `#${c
    .map((v) =>
      Math.round(clamp(v, 0, 255))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

/** Linear mix of two colours: `t = 0` → `a`, `t = 1` → `b`. */
export const mix = (a: string, b: string, t: number): string => {
  const ca = rgb(a);
  const cb = rgb(b);
  return toHex(ca.map((v, i) => v + ((cb[i] ?? 0) - v) * t));
};

/** `rgba()` string from a hex colour. */
export const alpha = (hex: string, a: number): string =>
  `rgba(${rgb(hex).join(',')},${clamp(a, 0, 1)})`;

/** WCAG relative luminance (0 = black, 1 = white). */
export const luminance = (hex: string): number => {
  const [r, g, b] = rgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const isDark = (hex: string): boolean => luminance(hex) < 0.4;

/** Small deterministic string hash (djb2), for decorative IDs and barcodes. */
export const hash = (value: string): number => {
  let h = 5381;
  for (let i = 0; i < value.length; i++) h = ((h << 5) + h + value.charCodeAt(i)) >>> 0;
  return h;
};
