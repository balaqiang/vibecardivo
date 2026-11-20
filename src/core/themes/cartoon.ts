import { family } from '../catalog/fonts.js';
import { a, avatarImg, nameStyle, socialList } from '../layout.js';
import type { ThemeRenderer } from '../types.js';

const INK = '#111111';
const YELLOW = '#ffd60a';
/** 16-point starburst. */
const BURST =
  'polygon(50% 0,59% 18%,78% 7%,76% 28%,98% 26%,84% 43%,100% 55%,80% 63%,90% 82%,69% 78%,62% 100%,50% 83%,38% 100%,31% 78%,10% 82%,20% 63%,0 55%,16% 43%,2% 26%,24% 28%,22% 7%,41% 18%)';

export const cartoon: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    return `
<div class="action"></div>
<div class="layout">
  <div class="info">
    <h1 class="name a a-l" ${nameStyle(ctx, 46, 12, 0)}>${text.name}</h1>
    ${text.role ? `<p ${a('caption', 1)}>${text.role}</p>` : ''}
    ${text.description ? `<div ${a('bubble', 2)}><p>${text.description}</p></div>` : ''}
    ${text.skills.length ? `<ul ${a('skills', 3)}>${text.skills.map((s) => `<li>${s}</li>`).join('')}</ul>` : ''}
  </div>
  ${
    ctx.avatar
      ? `<div ${a('pic', 1, 'r')}><span class="burst"><span>WOW!</span></span><div class="ring">${avatarImg(ctx)}</div></div>`
      : ''
  }
</div>
${socialList(ctx, 'socials', 4)}`;
  },
  css: () => `
.card{font-family:${family('Comic Neue', 'cursive')};font-weight:700;box-shadow:inset 0 0 0 4px ${INK}}
.action{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 78% 48%,rgba(255,255,255,.32) 0 5deg,transparent 5deg 14deg);-webkit-mask-image:radial-gradient(circle at 78% 48%,transparent 70px,#000 72px);mask-image:radial-gradient(circle at 78% 48%,transparent 70px,#000 72px)}
.layout{position:relative;display:flex;gap:28px;align-items:center;height:100%;padding:22px 30px 64px 34px}
.info{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start}
.name{font-family:${family('Bangers', 'cursive')};font-weight:400;letter-spacing:.04em;line-height:1;color:${YELLOW};-webkit-text-stroke:2px ${INK};paint-order:stroke fill;text-shadow:4px 4px 0 ${INK};rotate:-2deg;margin-bottom:10px}
.caption{font-size:12px;text-transform:uppercase;letter-spacing:.05em;background:${YELLOW};color:${INK};border:2px solid ${INK};padding:2px 10px;rotate:1deg;margin-bottom:12px;box-shadow:2px 2px 0 ${INK}}
.bubble{position:relative;align-self:stretch;background:#fff;border:3px solid ${INK};border-radius:22px;padding:9px 14px;box-shadow:3px 3px 0 ${INK}}
.bubble p{font-size:13px;line-height:1.35;color:${INK};display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.bubble::before{content:'';position:absolute;right:-21px;top:22px;border-style:solid;border-width:11px 0 11px 20px;border-color:transparent transparent transparent ${INK}}
.bubble::after{content:'';position:absolute;right:-14px;top:25px;border-style:solid;border-width:8px 0 8px 15px;border-color:transparent transparent transparent #fff}
.skills{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.skills li{font-size:11px;padding:2px 9px;background:#fff;color:${INK};border:2px solid ${INK};border-radius:999px}
.pic{position:relative;width:150px;height:150px;flex:none}
.ring{position:relative;width:150px;height:150px;border-radius:50%;border:4px solid ${INK};background:#fff;box-shadow:5px 5px 0 ${INK};overflow:hidden}
.ring .avatar{border-radius:0;clip-path:none}
.ring:has(.shape-square),.ring:has(.shape-hexagon){border-radius:10px}
.ring:has(.shape-rounded){border-radius:28%}
.burst{position:absolute;left:-34px;top:-26px;z-index:1;width:76px;height:76px;display:flex;align-items:center;justify-content:center;background:${INK};clip-path:${BURST};rotate:-12deg}
.burst::before{content:'';position:absolute;inset:4px;background:${YELLOW};clip-path:${BURST}}
.burst span{position:relative;font-family:${family('Bangers', 'cursive')};font-size:17px;color:var(--accent)}
.socials{position:absolute;left:34px;right:30px;bottom:20px;gap:6px}
.social{font-size:11px;padding:3px 10px 3px 7px;background:#fff;color:${INK};border:2px solid ${INK};border-radius:999px}
.social .icon{color:var(--accent)}`,
};
