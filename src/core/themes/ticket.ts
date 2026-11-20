import { family } from '../catalog/fonts.js';
import type { IconDef } from '../catalog/platforms.js';
import { a, avatarImg, icon, nameStyle } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { esc, hash, toAscii } from '../utils.js';

const PLANE: IconDef = {
  stroke: true,
  path: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
};

/** Three-letter "airport code" from the location: "Bali, Indonesia" → "BAL". */
const code = (place: string, fallback: string): string =>
  toAscii(place)
    .replace(/[^a-z]/gi, '')
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, 'X') || fallback;

/** Deterministic barcode as a CSS gradient. */
function barcode(seed: string): string {
  let h = hash(seed) || 1;
  const stops: string[] = [];
  let x = 0;
  for (let i = 0; i < 34; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const bar = 1 + (h % 3);
    const gap = 1 + ((h >> 8) % 3);
    stops.push(`var(--text) ${x}px ${x + bar}px`, `transparent ${x + bar}px ${x + bar + gap}px`);
    x += bar + gap;
  }
  return `linear-gradient(90deg,${stops.join(',')})`;
}

const field = (label: string, value: string, cls = '') =>
  value
    ? `<div class="field ${cls}"><span class="k">${label}</span><span class="v">${value}</span></div>`
    : '';

export const ticket: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    const from = text.location ? code(ctx.opts.location, 'HOM') : 'HOM';
    const flight = `VC ${100 + (hash(ctx.opts.name) % 900)}`;
    const seat = `${1 + (hash(ctx.opts.role || ctx.opts.name) % 30)}${'ABCDEF'[hash(ctx.opts.name) % 6]}`;
    const links = ctx.socials
      .map((s) => `<li>${icon(s.platform.icon)}${esc(s.handle)}</li>`)
      .join('');
    return `
<div class="pass">
  <i class="notch top"></i><i class="notch bottom"></i>
  <div class="main">
    <header ${a('strip', 0)}>${icon(PLANE)}<b>VIBECARD AIR</b><span>BOARDING PASS</span></header>
    <div class="body">
      <div class="row">
        <div class="field grow"><span class="k">PASSENGER</span><span class="v name a a-l" ${nameStyle(ctx, 24, 16, 1)}>${text.name}</span></div>
        ${field('FLIGHT', flight)}
      </div>
      <div ${a('route', 2)}>
        <div><b>${esc(from)}</b><span>${text.location || 'Home base'}</span></div>
        <span class="path">${icon(PLANE)}</span>
        <div class="to"><b>WEB</b><span>The Internet</span></div>
      </div>
      <div ${a('row', 3)}>
        ${field('CLASS', text.role || 'Explorer', 'grow')}
        ${field('SEAT', seat)}
      </div>
      ${text.skills.length ? `<div ${a('row', 4)}>${field('BAGGAGE', text.skills.join(' · '), 'grow')}</div>` : ''}
      ${links ? `<ul ${a('links', 5)}>${links}</ul>` : ''}
    </div>
  </div>
  <div ${a('stub', 1, 'r')}>
    <span class="k">BOARDING PASS</span>
    ${ctx.avatar ? `<div class="pic">${avatarImg(ctx)}</div>` : ''}
    <span class="who">${text.name}</span>
    <span class="k">${esc(from)} → WEB · ${seat}</span>
    <span class="barcode" style="background:${barcode(ctx.opts.name)}"></span>
  </div>
</div>`;
  },
  css: () => `
.card{font-family:${family('Space Grotesk')}}
.pass{position:absolute;inset:18px;display:flex;background:var(--surface);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.35);overflow:hidden}
.notch{position:absolute;left:calc(100% - 176px);width:26px;height:26px;margin-left:-13px;border-radius:50%;background:var(--bg);z-index:2}
.notch.top{top:-13px}
.notch.bottom{bottom:-13px}
.main{flex:1;min-width:0;display:flex;flex-direction:column}
.strip{display:flex;align-items:center;gap:8px;height:34px;padding:0 18px;background:var(--accent);color:#fff;font-size:11px;letter-spacing:.12em}
.strip .icon{width:15px;height:15px;color:#fff;rotate:45deg}
.strip span{margin-left:auto;font-family:${family('JetBrains Mono', 'monospace')};font-size:9.5px;opacity:.9}
.body{flex:1;display:flex;flex-direction:column;gap:8px;padding:10px 18px 12px}
.row{display:flex;gap:16px}
.field{display:flex;flex-direction:column;min-width:0}
.grow{flex:1}
.k{font-family:${family('JetBrains Mono', 'monospace')};font-size:8.5px;letter-spacing:.12em;color:var(--muted)}
.v{font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.name{font-weight:700;line-height:1.15;letter-spacing:-.01em}
.route{display:flex;align-items:center;gap:12px;padding:6px 0;border-top:1px dashed var(--border);border-bottom:1px dashed var(--border)}
.route div{display:flex;flex-direction:column;min-width:0}
.route b{font-size:30px;line-height:1;letter-spacing:.02em;color:var(--text)}
.route span{font-size:10px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px}
.route .to{align-items:flex-end;text-align:right}
.path{flex:1;position:relative;display:flex;justify-content:center;border-top:1.5px dashed var(--accent);height:0}
.path .icon{position:absolute;top:-9px;width:18px;height:18px;color:var(--accent);background:var(--surface);rotate:45deg}
.links{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:auto;font-size:10.5px;font-weight:500;color:var(--muted)}
.links li{display:inline-flex;align-items:center;gap:5px}
.links .icon{width:12px;height:12px}
.stub{width:176px;flex:none;display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 14px 12px;border-left:2px dashed var(--border);text-align:center}
.pic{width:86px;height:86px;margin-top:2px}
.who{font-size:13px;font-weight:700;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.barcode{width:132px;height:34px;margin-top:auto;opacity:.85}`,
};
