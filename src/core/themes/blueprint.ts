import { family } from '../catalog/fonts.js';
import { a, avatarImg, nameStyle } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { alpha, esc } from '../utils.js';

export const blueprint: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    const refs = ctx.socials
      .map((s) => `<span>${esc(s.platform.short)}/${esc(s.handle)}</span>`)
      .join('');
    return `
<div class="sheet"></div>
<div class="layout">
  <div class="info">
    <p ${a('label', 0)}>FIG. A — PROFILE ELEVATION</p>
    <h1 class="name a a-l" ${nameStyle(ctx, 32, 16, 1)}>${text.name}</h1>
    ${text.role ? `<p ${a('row', 2)}><b>ROLE</b>${text.role}</p>` : ''}
    ${text.description ? `<p ${a('note', 3)}><b>NOTE 1</b><span>${text.description}</span></p>` : ''}
    ${text.skills.length ? `<p ${a('row', 4)}><b>MATERIALS</b>${text.skills.join(' · ')}</p>` : ''}
    ${refs ? `<p ${a('row refs', 5)}><b>REF</b>${refs}</p>` : ''}
  </div>
  <div class="side">
    ${
      ctx.avatar
        ? `<div ${a('drawing', 1, 'r')}><i class="axis h"></i><i class="axis v"></i>${avatarImg(ctx)}<span class="dim"><em>⌀ 120</em></span><span class="callout">SUBJECT</span></div>`
        : ''
    }
    <table ${a('title-block', 6, 'u')}>
      <tr><th>PROJECT</th><td colspan="3">VIBECARD</td></tr>
      <tr><th>DRAWN BY</th><td colspan="3">${text.name}</td></tr>
      <tr><th>SITE</th><td colspan="3">${text.location || text.site || '—'}</td></tr>
      <tr><th>SCALE</th><td>1 : 1</td><th>SHEET</th><td>1/1</td></tr>
    </table>
  </div>
</div>`;
  },
  css: (ctx) => {
    const line = alpha(ctx.palette.text, 0.75);
    return `
.card{font-family:${family('JetBrains Mono', 'monospace')};background:${ctx.customBackground ? 'var(--bg)' : `linear-gradient(${alpha('#ffffff', 0.05)} 1px,transparent 1px) 0 0/8px 8px,linear-gradient(90deg,${alpha('#ffffff', 0.05)} 1px,transparent 1px) 0 0/8px 8px,var(--bg)`}}
.sheet{position:absolute;inset:12px;border:1.5px solid ${line};outline:1px solid ${alpha(ctx.palette.text, 0.35)};outline-offset:3px}
.layout{position:relative;display:flex;gap:18px;height:100%;padding:26px 30px 26px 34px}
.info{flex:1;min-width:0;display:flex;flex-direction:column}
.label{font-size:9px;letter-spacing:.14em;color:var(--muted);margin-bottom:4px}
.name{font-family:${family('Architects Daughter', 'cursive')};font-weight:400;line-height:1.15;letter-spacing:.02em;padding-bottom:4px;margin-bottom:10px;border-bottom:1px solid ${line}}
.row,.note{display:flex;gap:10px;font-size:10.5px;line-height:1.5;margin-bottom:7px}
.row b,.note b{flex:none;width:76px;font-weight:400;font-size:9px;letter-spacing:.1em;color:var(--muted);padding-top:1px}
.note span{font-family:${family('Architects Daughter', 'cursive')};font-size:13px;line-height:1.4;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.refs{flex-wrap:wrap;row-gap:2px}
.refs span{margin-right:12px}
.side{width:200px;flex:none;display:flex;flex-direction:column;align-items:center;justify-content:space-between}
.drawing{position:relative;width:118px;height:118px;margin-top:10px}
.drawing .avatar{border:1.5px solid var(--text);filter:grayscale(1) sepia(1) hue-rotate(175deg) saturate(1.8) brightness(.9) contrast(1.1);opacity:.92}
.axis{position:absolute;border-color:${line};border-style:dashed;border-width:0}
.axis.h{left:-18px;right:-18px;top:50%;border-top-width:1px}
.axis.v{top:-14px;bottom:-14px;left:50%;border-left-width:1px}
.dim{position:absolute;left:0;right:0;bottom:-20px;height:1px;background:${line}}
.dim::before,.dim::after{content:'';position:absolute;top:-4px;width:1px;height:9px;background:${line}}
.dim::before{left:0}
.dim::after{right:0}
.dim em{position:absolute;left:50%;top:-7px;transform:translateX(-50%);padding:0 5px;font-size:9px;font-style:normal;background:var(--bg)}
.callout{position:absolute;right:-36px;top:2px;font-size:8.5px;letter-spacing:.1em;color:var(--muted);padding-bottom:2px;border-bottom:1px solid ${line}}
.title-block{width:200px;border-collapse:collapse;font-size:8.5px;margin-top:28px}
.title-block th,.title-block td{border:1px solid ${line};padding:2px 5px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px}
.title-block th{font-weight:400;color:var(--muted);letter-spacing:.06em}
.title-block td{color:var(--text)}`;
  },
};
