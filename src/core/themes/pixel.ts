import { family } from '../catalog/fonts.js';
import { a, avatarImg, nameStyle, socialList } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { mix } from '../utils.js';

/** Stepped "pixel" border made of box-shadows. */
const pixelBorder = (c: string, s = 4) =>
  `box-shadow:0 -${s}px 0 0 ${c},0 ${s}px 0 0 ${c},-${s}px 0 0 0 ${c},${s}px 0 0 0 ${c}`;

export const pixel: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    const level = Math.min(99, 10 + ctx.opts.skills.length * 9 + ctx.socials.length * 4);
    return `
<div class="screen">
  <div class="hud">
    ${ctx.avatar ? `<div ${a('pfp', 0)}>${avatarImg(ctx)}</div>` : ''}
    <div class="stats">
      <h1 class="name a a-l" ${nameStyle(ctx, 15, 16, 1)}>${text.name}</h1>
      <p ${a('row', 2)}><b>CLASS</b> ${text.role || 'Adventurer'}</p>
      <p ${a('row', 3)}><b>LV</b> ${level} <b class="gap">HP</b> <span class="hp"></span></p>
      ${text.location ? `<p ${a('row', 4)}><b>BASE</b> ${text.location}</p>` : ''}
      ${text.skills.length ? `<p ${a('row items', 5)}><b>ITEMS</b> ${text.skills.join(', ')}</p>` : ''}
    </div>
  </div>
  ${text.description ? `<div ${a('dialog', 6, 'u')}><p>${text.description}</p><span class="caret">▼</span></div>` : ''}
  ${socialList(ctx, 'socials', 7)}
</div>`;
  },
  css: (ctx) => {
    const p = ctx.palette;
    const light = mix(p.background, '#ffffff', 0.3);
    return `
.card{font-family:${family('VT323', 'monospace')}}
.screen{position:absolute;inset:14px;padding:16px 20px 12px;background:var(--surface);display:flex;flex-direction:column;${pixelBorder(p.border)}}
.hud{display:flex;gap:18px;align-items:center}
.pfp{width:96px;height:96px;flex:none;background:var(--bg);${pixelBorder(p.border)}}
.pfp .avatar{image-rendering:pixelated;filter:grayscale(1) contrast(1.5) brightness(1.05);mix-blend-mode:multiply}
.stats{min-width:0;display:flex;flex-direction:column;gap:2px}
.name{font-family:${family('Press Start 2P', 'monospace')};font-weight:400;line-height:1.4;text-transform:uppercase;margin-bottom:6px;color:var(--text)}
.row{font-size:19px;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row b{font-weight:400;color:var(--muted);margin-right:4px}
.row .gap{margin-left:12px}
.hp{display:inline-block;width:96px;height:10px;vertical-align:1px;background:repeating-linear-gradient(90deg,var(--text) 0 8px,transparent 8px 10px)}
.items{white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1}
.dialog{position:relative;margin-top:14px;padding:8px 26px 8px 12px;background:${light};${pixelBorder(p.border)}}
.dialog p{font-size:18px;line-height:1.05;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.caret{position:absolute;right:8px;bottom:4px;font-size:14px;animation:cv-bob .8s steps(2) infinite}
@keyframes cv-bob{50%{transform:translateY(3px)}}
.socials{margin-top:auto;gap:4px 16px;font-size:17px}
.socials .icon{width:13px;height:13px;color:var(--accent)}`;
  },
};
