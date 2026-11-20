import { family } from '../catalog/fonts.js';
import { a, avatarImg, icon, nameStyle } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { alpha, esc, hash } from '../utils.js';
import { loginName } from './hacker.js';

const MAGENTA = '#ff2a6d';
const YELLOW = '#f5e900';
const CUT = 'polygon(0 0,calc(100% - 26px) 0,100% 26px,100% 100%,26px 100%,0 calc(100% - 26px))';

export const cyberpunk: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    const id = hash(ctx.opts.name).toString(16).toUpperCase().padStart(8, '0').slice(0, 6);
    const mods = text.skills.map((s) => `<li>${s}</li>`).join('');
    const links = ctx.socials
      .map((s) => `<li>${icon(s.platform.icon)}<span>${esc(s.handle)}</span></li>`)
      .join('');
    return `
<div class="frame"><div class="inner"></div></div>
<div class="hazard"></div>
<div class="layout">
  <div class="info">
    <p ${a('tag', 0)}><span>ID//${id}</span><span class="dim">@${esc(loginName(ctx))}</span></p>
    <h1 class="name a a-l" data-text="${text.name}" ${nameStyle(ctx, 34, 14, 1)}>${text.name}</h1>
    ${text.role ? `<p ${a('role', 2)}>${text.role}</p>` : ''}
    ${text.description ? `<p ${a('desc', 3)}>${text.description}</p>` : ''}
    ${mods ? `<ul ${a('mods', 4)}>${mods}</ul>` : ''}
  </div>
  ${
    ctx.avatar
      ? `<div ${a('pic', 1, 'r')}><i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>${avatarImg(ctx)}<span class="scan"></span><p class="verified">// SUBJECT VERIFIED</p></div>`
      : ''
  }
</div>
<div ${a('foot', 5, 'u')}>${links ? `<ul class="links">${links}</ul>` : '<span></span>'}<span class="barcode"></span></div>`;
  },
  css: (ctx) => `
.card{font-family:${family('Chakra Petch')}}
.frame{position:absolute;inset:10px;background:var(--border);clip-path:${CUT};filter:drop-shadow(0 0 6px ${alpha(ctx.palette.border, 0.6)})}
.inner{position:absolute;inset:1.5px;background:${alpha(ctx.palette.background, 0.9)};clip-path:${CUT}}
.hazard{position:absolute;right:46px;top:10px;width:120px;height:7px;background:repeating-linear-gradient(-45deg,${YELLOW} 0 6px,transparent 6px 12px)}
.layout{position:relative;display:flex;gap:22px;height:100%;padding:28px 36px 64px 36px}
.info{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start}
.tag{display:flex;gap:12px;font-family:${family('JetBrains Mono', 'monospace')};font-size:10px;letter-spacing:.08em;color:var(--accent);margin-bottom:6px}
.tag .dim{color:var(--muted)}
.name{position:relative;font-weight:700;text-transform:uppercase;letter-spacing:.04em;line-height:1.05;margin-bottom:8px;text-shadow:0 0 12px ${alpha(ctx.palette.accent, 0.35)}}
.name::before,.name::after{content:attr(data-text);position:absolute;inset:0;overflow:hidden;pointer-events:none}
.name::before{color:${MAGENTA};transform:translateX(-2px);clip-path:inset(0 0 62% 0);animation:cv-glitch-a 3.2s steps(1) infinite}
.name::after{color:var(--accent);transform:translateX(2px);clip-path:inset(58% 0 0 0);animation:cv-glitch-b 2.7s steps(1) infinite}
@keyframes cv-glitch-a{0%,86%,100%{clip-path:inset(0 0 100% 0)}88%{clip-path:inset(10% 0 55% 0);transform:translateX(-4px)}92%{clip-path:inset(40% 0 30% 0);transform:translateX(3px)}}
@keyframes cv-glitch-b{0%,78%,100%{clip-path:inset(100% 0 0 0)}80%{clip-path:inset(60% 0 8% 0);transform:translateX(4px)}84%{clip-path:inset(25% 0 50% 0);transform:translateX(-3px)}}
.role{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#07070d;background:${YELLOW};padding:3px 16px 3px 8px;clip-path:polygon(0 0,100% 0,calc(100% - 9px) 100%,0 100%);margin-bottom:10px}
.desc{font-size:12.5px;font-weight:500;line-height:1.5;color:var(--muted);-webkit-line-clamp:3}
.mods{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.mods li{font-family:${family('JetBrains Mono', 'monospace')};font-size:10px;padding:2px 8px;color:var(--text);background:${alpha(ctx.palette.accent, 0.08)};border-left:2px solid ${MAGENTA}}
.mods li::before{content:'+ ';color:${MAGENTA}}
.pic{position:relative;width:136px;height:136px;flex:none;margin-top:14px;padding:8px}
.pic .avatar{filter:saturate(1.2) contrast(1.05);box-shadow:0 0 0 1px var(--accent)}
.c{position:absolute;width:16px;height:16px;border:2px solid var(--accent)}
.tl{left:0;top:0;border-right:0;border-bottom:0}
.tr{right:0;top:0;border-left:0;border-bottom:0}
.bl{left:0;bottom:0;border-right:0;border-top:0}
.br{right:0;bottom:0;border-left:0;border-top:0}
.scan{position:absolute;left:8px;right:8px;top:8px;height:3px;background:var(--accent);box-shadow:0 0 10px var(--accent);opacity:.8;animation:cv-scan 2.6s ease-in-out infinite alternate}
@keyframes cv-scan{to{transform:translateY(117px)}}
.verified{position:absolute;left:0;right:0;bottom:-20px;text-align:center;font-family:${family('JetBrains Mono', 'monospace')};font-size:8.5px;letter-spacing:.1em;color:${YELLOW}}
.foot{position:absolute;left:36px;right:40px;bottom:26px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.links{display:flex;flex-wrap:wrap;gap:4px 14px;font-family:${family('JetBrains Mono', 'monospace')};font-size:10.5px}
.links li{display:inline-flex;align-items:center;gap:5px}
.links .icon{width:12px;height:12px}
.barcode{width:92px;height:20px;flex:none;opacity:.75;background:repeating-linear-gradient(90deg,var(--text) 0 2px,transparent 2px 4px,var(--text) 4px 5px,transparent 5px 8px,var(--text) 8px 11px,transparent 11px 13px)}`,
};
