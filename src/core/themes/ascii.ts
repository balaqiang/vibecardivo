import { imageToAscii } from '../ascii/art.js';
import { banner } from '../ascii/figlet.js';
import { family } from '../catalog/fonts.js';
import type { RenderContext, ThemeRenderer } from '../types.js';
import { esc, initials, isDark, toAscii, wrap } from '../utils.js';

/** Grid geometry: 12px JetBrains Mono → 7.2px advance, 15px rows → 84 × 19 cells. */
const COLS = 84;
const ROWS = 19;
const INNER = ROWS - 2;
const ART_COLS = 30;
const ART_ROWS = 14;

interface Seg {
  t: string;
  c?: string;
}
type Row = Seg[];

const len = (row: Row) => row.reduce((n, s) => n + s.t.length, 0);
const fitRow = (row: Row, width: number): Row => {
  const out: Row = [];
  let used = 0;
  for (const s of row) {
    if (used >= width) break;
    const t = s.t.slice(0, width - used);
    out.push({ ...s, t });
    used += t.length;
  }
  if (used < width) out.push({ t: ' '.repeat(width - used) });
  return out;
};
const center = (text: string, width: number, c?: string): Row => {
  const left = Math.max(0, Math.floor((width - text.length) / 2));
  return fitRow([{ t: ' '.repeat(left) }, { t: text, c }], width);
};

/** Packs `items` (joined by `sep`) into at most `maxLines` lines of `width`; overflow is dropped. */
const packLines = (items: string[], width: number, sep = '  ', maxLines = 1): string[] => {
  const lines: string[] = [];
  let line = '';
  for (const item of items.map((i) => i.slice(0, width))) {
    const next = line ? `${line}${sep}${item}` : item;
    if (next.length <= width) line = next;
    else if (lines.length + 1 < maxLines) {
      lines.push(line);
      line = item;
    } else break;
  }
  if (line) lines.push(line);
  return lines;
};

function leftColumn(ctx: RenderContext, width: number): Row[] {
  const name = toAscii(ctx.opts.name) || 'ANONYMOUS';
  const role = toAscii(ctx.opts.role);
  const desc = toAscii(ctx.opts.description);

  const top: Row[] = [];
  const art = banner(name, width, 6);
  if (art) for (const r of art) top.push([{ t: r, c: 'hl' }]);
  else for (const r of wrap(name.toUpperCase(), width, 2)) top.push([{ t: r, c: 'hl b' }]);
  if (role)
    top.push([
      { t: '> ', c: 'dim' },
      { t: role, c: 'b' },
    ]);
  top.push([{ t: '-'.repeat(width), c: 'dim' }]);

  const bottom: Row[] = [];
  const site = ctx.opts.site.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  const meta = [
    site && `www: ${toAscii(site)}`,
    ctx.opts.location && `loc: ${toAscii(ctx.opts.location)}`,
  ].filter(Boolean) as string[];
  for (const t of packLines(meta, width, '   ')) bottom.push([{ t, c: 'dim' }]);
  for (const t of packLines(
    ctx.opts.skills.map((s) => `[${toAscii(s)}]`),
    width,
    ' ',
  ))
    bottom.push([{ t }]);
  const socials = ctx.socials.map((s) => `${s.platform.short}:${toAscii(s.handle)}`);
  for (const t of packLines(socials, width, '  ', 2)) bottom.push([{ t, c: 'link' }]);

  const room = INNER - top.length - bottom.length - (bottom.length ? 1 : 0);
  const body: Row[] = desc && room > 0 ? wrap(desc, width, room).map((t) => [{ t }]) : [];
  const filler = Array.from(
    { length: Math.max(0, INNER - top.length - body.length - bottom.length) },
    () => [{ t: '' }],
  );
  return [...top, ...body, ...filler, ...bottom].slice(0, INNER).map((r) => fitRow(r, width));
}

function rightColumn(ctx: RenderContext, width: number): Row[] {
  const dark = isDark(ctx.palette.background);
  const avatar = ctx.avatar;
  let art =
    avatar?.bytes && avatar.mime
      ? imageToAscii(avatar.bytes, avatar.mime, ART_COLS, ART_ROWS, dark)
      : null;
  if (!art) {
    const big = banner(initials(ctx.opts.name) || '?', width - 4, 6) ?? [initials(ctx.opts.name)];
    const padTop = Math.floor((ART_ROWS - big.length) / 2);
    art = Array.from({ length: ART_ROWS }, (_, i) => big[i - padTop] ?? '');
  }
  const caption = `~/${(
    toAscii(ctx.opts.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '') || 'me'
  ).slice(0, 14)}.png`;
  const rows: Row[] = [
    [{ t: '' }],
    ...art.map((r) => center(r, width, 'art')),
    [{ t: '' }],
    center(caption, width, 'dim'),
  ];
  while (rows.length < INNER) rows.push([{ t: '' }]);
  return rows.slice(0, INNER).map((r) => fitRow(r, width));
}

function grid(ctx: RenderContext): Row[] {
  const withArt = Boolean(ctx.avatar);
  const rightW = withArt ? ART_COLS : 0;
  const leftW = withArt ? COLS - 7 - rightW : COLS - 4;
  const left = leftColumn(ctx, leftW);
  const right = withArt ? rightColumn(ctx, rightW) : [];
  const junction = 2 + leftW + 1;

  const label = `[ ${(
    toAscii(ctx.opts.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') || 'card'
  ).slice(0, 24)}.txt ]`;
  const border = (tag: string, tagAtEnd: boolean): Row => {
    const chars = ['+', ...'-'.repeat(COLS - 2), '+'];
    if (withArt) chars[junction] = '+';
    const start = tagAtEnd ? COLS - tag.length - 3 : 2;
    [...tag].forEach((ch, i) => {
      chars[start + i] = ch;
    });
    return [{ t: chars.join(''), c: 'frame' }];
  };

  const rows: Row[] = [border(label, false)];
  for (let i = 0; i < INNER; i++) {
    const row: Row = [{ t: '| ', c: 'frame' }, ...(left[i] ?? fitRow([], leftW))];
    if (withArt) row.push({ t: ' | ', c: 'frame' }, ...(right[i] ?? fitRow([], rightW)));
    row.push({ t: ' |', c: 'frame' });
    rows.push(row);
  }
  rows.push(border('[ EOF ]', true));
  return rows.map((r) => (len(r) === COLS ? r : fitRow(r, COLS)));
}

export const ascii: ThemeRenderer = {
  body: (ctx) => {
    const rows = grid(ctx)
      .map(
        (row, i) =>
          `<span class="r a a-l" style="--i:${i}">${row
            .map((s) => (s.c ? `<span class="${s.c}">${esc(s.t)}</span>` : esc(s.t)))
            .join('')}</span>`,
      )
      .join('');
    return `<div class="ascii">${rows}</div>`;
  },
  css: () => `
.card{font-family:${family('JetBrains Mono', 'monospace')}}
.ascii{position:relative;padding:17px 0 0 18px;font-size:12px;line-height:15px;letter-spacing:0}
.r{display:block;white-space:pre;height:15px}
.ascii .a{animation-delay:calc(var(--i,0) * 70ms)}
.frame{color:var(--border)}
.hl{color:var(--accent);font-weight:700}
.b{font-weight:700}
.dim{color:var(--muted)}
.art{color:var(--text);opacity:.9}
.link{color:var(--accent)}`,
};
