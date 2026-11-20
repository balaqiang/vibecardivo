import { family } from '../catalog/fonts.js';
import { a, avatarImg, metaLine, nameStyle, skillList, socialList } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { alpha } from '../utils.js';

export const lofi: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    return `
<div class="glow"></div>
<div class="layout">
  <div class="info">
    <p ${a('np', 0)}><span class="eq"><i></i><i></i><i></i><i></i></span>now playing</p>
    <h1 class="name a a-l" ${nameStyle(ctx, 30, 18, 1)}>${text.name}</h1>
    ${text.role ? `<p ${a('role', 2)}>♪ ${text.role}</p>` : ''}
    ${text.description ? `<p ${a('desc', 3)}>${text.description}</p>` : ''}
    ${metaLine(ctx, 'meta', 4)}
    ${skillList(ctx, 'skills', 5)}
  </div>
  ${
    ctx.avatar
      ? `<div ${a('deck', 1, 'r')}><div class="vinyl"><div class="label">${avatarImg(ctx)}</div></div><div class="arm"></div></div>`
      : ''
  }
</div>
${socialList(ctx, 'socials', 6)}
<div ${a('player', 7, 'u')}><span>1:24</span><div class="track"><i></i></div><span>3:08</span></div>`;
  },
  css: (ctx) => {
    const bg = ctx.customBackground
      ? 'var(--bg)'
      : 'linear-gradient(158deg,#1d1430 0%,#36224f 42%,#7d4a6d 78%,#d98468 112%)';
    return `
.card{font-family:${family('Quicksand')};background:${bg}}
.glow{position:absolute;width:260px;height:260px;right:40px;top:-70px;border-radius:50%;background:radial-gradient(circle,${alpha(ctx.palette.accent, 0.35)},transparent 65%)}
.layout{position:relative;display:flex;align-items:center;gap:22px;height:100%;padding:22px 30px 80px 34px}
.info{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start}
.np{display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);padding:4px 10px;border-radius:999px;background:${alpha(ctx.palette.accent, 0.12)};margin-bottom:10px}
.eq{display:inline-flex;align-items:flex-end;gap:2px;height:10px}
.eq i{display:block;width:2px;height:100%;border-radius:1px;background:var(--accent);transform-origin:bottom;animation:cv-eq 1s ease-in-out infinite}
.eq i:nth-child(2){animation-delay:-.3s}
.eq i:nth-child(3){animation-delay:-.6s}
.eq i:nth-child(4){animation-delay:-.15s}
@keyframes cv-eq{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
.name{font-weight:700;line-height:1.1;letter-spacing:-.01em;margin-bottom:4px}
.role{font-size:13px;font-weight:700;color:var(--accent);margin-bottom:8px}
.desc{font-size:12.5px;font-weight:500;line-height:1.5;color:var(--muted);-webkit-line-clamp:3}
.meta{gap:4px 12px;margin-top:8px;font-size:11px;color:var(--muted)}
.skills{gap:5px;margin-top:8px}
.skill{font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.1)}
.deck{position:relative;width:184px;height:184px;flex:none}
.vinyl{width:184px;height:184px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle,transparent 0 29%,#0d0a12 29.5% 31%,transparent 31.5%),repeating-radial-gradient(circle,#17121d 0 1.5px,#221a2b 1.5px 3px);
  box-shadow:0 14px 34px rgba(0,0,0,.5),inset 0 0 0 5px #0d0a12;animation:cv-spin 7s linear infinite}
.vinyl::after{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 20deg,transparent 0 8%,rgba(255,255,255,.13) 12%,transparent 18% 58%,rgba(255,255,255,.09) 62%,transparent 68%)}
.label{width:76px;height:76px;border-radius:50%;overflow:hidden;border:3px solid var(--accent)}
.label .avatar{border-radius:50%;clip-path:none}
.arm{position:absolute;right:-8px;top:-6px;width:10px;height:96px;border-radius:5px;background:linear-gradient(#f5e6da,#b9a596);transform-origin:50% 8px;transform:rotate(24deg);box-shadow:0 4px 10px rgba(0,0,0,.4)}
.arm::after{content:'';position:absolute;left:-4px;bottom:-6px;width:18px;height:16px;border-radius:3px;background:#f5e6da}
@keyframes cv-spin{to{transform:rotate(360deg)}}
.socials{position:absolute;left:34px;right:30px;bottom:44px;gap:6px}
.social{font-size:11px;font-weight:700;padding:4px 10px 4px 8px;border-radius:999px;background:rgba(255,255,255,.1)}
.player{position:absolute;left:34px;right:30px;bottom:18px;display:flex;align-items:center;gap:10px;font-size:9.5px;font-weight:700;color:var(--muted)}
.track{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.18);overflow:hidden}
.track i{display:block;height:100%;width:38%;border-radius:2px;background:var(--accent);animation:cv-progress 24s linear infinite}
@keyframes cv-progress{from{width:38%}to{width:100%}}`;
  },
};
