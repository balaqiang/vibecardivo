import { family } from '../catalog/fonts.js';
import { a, avatarImg, icon, nameStyle } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { alpha, esc } from '../utils.js';

const RULE = 24;

export const notebook: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    const todo = text.skills.map((s) => `<li><span class="box">✓</span>${s}</li>`).join('');
    const links = ctx.socials
      .map((s) => `<li>${icon(s.platform.icon)}${esc(s.handle)}</li>`)
      .join('');
    return `
<div class="holes"><i></i><i></i><i></i></div>
<div class="layout">
  <div class="info">
    <h1 class="name a a-l" ${nameStyle(ctx, 44, 14, 0)}><span class="hl">${text.name}</span></h1>
    ${text.description ? `<p ${a('desc', 2)}>${text.description}</p>` : ''}
    ${todo ? `<ul ${a('todo', 3)}>${todo}</ul>` : ''}
    ${links ? `<ul ${a('links', 4)}>${links}</ul>` : ''}
  </div>
  <div class="side">
    ${
      ctx.avatar
        ? `<figure ${a('polaroid', 1, 'r')}><span class="tape"></span>${avatarImg(ctx)}<figcaption>${text.location || 'me :)'}</figcaption></figure>`
        : ''
    }
    ${text.role ? `<p ${a('sticky', 2, 'r')}>${text.role}</p>` : ''}
  </div>
</div>`;
  },
  css: (ctx) => {
    const p = ctx.palette;
    const paper = ctx.customBackground
      ? 'var(--bg)'
      : `linear-gradient(90deg,transparent 58px,${alpha(p.accent, 0.55)} 58px 60px,transparent 60px),repeating-linear-gradient(transparent 0 ${RULE - 1}px,${p.border} ${RULE - 1}px ${RULE}px) 0 14px,var(--bg)`;
    return `
.card{font-family:${family('Caveat', 'cursive')};background:${paper}}
.holes{position:absolute;left:18px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:space-around;padding:30px 0}
.holes i{width:16px;height:16px;border-radius:50%;background:#d9d4c3;box-shadow:inset 1px 2px 3px rgba(0,0,0,.25)}
.layout{position:relative;display:flex;gap:16px;height:100%;padding:14px 26px 14px 76px}
.info{flex:1;min-width:0;display:flex;flex-direction:column}
.name{font-weight:700;line-height:${RULE * 2}px;height:${RULE * 2}px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)}
.hl{background:linear-gradient(transparent 52%,rgba(255,224,70,.75) 52% 88%,transparent 88%);padding:0 4px}
.desc{font-size:21px;font-weight:500;line-height:${RULE}px;color:var(--text);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.todo{display:flex;flex-wrap:wrap;gap:0 16px;font-size:20px;font-weight:500;line-height:${RULE}px;margin-top:${RULE}px}
.box{display:inline-block;width:15px;height:15px;margin-right:4px;border:1.5px solid var(--text);border-radius:3px;font-size:13px;line-height:12px;text-align:center;color:var(--accent);vertical-align:-1px}
.links{display:flex;flex-wrap:wrap;gap:0 14px;font-size:19px;font-weight:500;line-height:${RULE}px;margin-top:auto;color:var(--muted)}
.links li{display:inline-flex;align-items:center;gap:4px}
.links .icon{width:13px;height:13px;color:var(--text)}
.side{position:relative;width:170px;flex:none}
.polaroid{position:absolute;right:6px;top:18px;width:142px;padding:9px 9px 6px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.18),0 1px 2px rgba(0,0,0,.2);rotate:4deg}
.polaroid .avatar{width:124px;height:124px;border-radius:0;clip-path:none}
.polaroid figcaption{font-size:17px;font-weight:700;text-align:center;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-top:2px}
.tape{position:absolute;left:44px;top:-10px;width:56px;height:20px;background:rgba(232,220,180,.75);rotate:-6deg;box-shadow:0 1px 2px rgba(0,0,0,.1)}
.sticky{position:absolute;left:-6px;bottom:20px;width:118px;min-height:62px;padding:8px 10px;background:var(--surface);font-size:19px;font-weight:700;line-height:1.05;color:var(--text);box-shadow:0 5px 10px rgba(0,0,0,.15);rotate:-5deg;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}`;
  },
};
