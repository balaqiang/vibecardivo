import { family } from '../catalog/fonts.js';
import { a, avatarImg, nameStyle, socialList } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { alpha } from '../utils.js';

/** Layered text-shadow that reads as a glowing glass tube. */
const glow = (c: string) =>
  `0 0 2px #fff,0 0 6px ${c},0 0 14px ${c},0 0 28px ${c},0 0 46px ${alpha(c, 0.6)}`;

export const neon: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    return `
<div class="vignette"></div>
<div class="tube"></div>
<p ${a('sign', 0, 'r')}><span class="dot"></span>ONLINE</p>
<div class="layout">
  <div class="info">
    <h1 class="name a a-l" ${nameStyle(ctx, 40, 12, 1)}>${text.name}</h1>
    ${text.role ? `<p ${a('role', 2)}>${text.role}</p>` : ''}
    ${text.description ? `<p ${a('desc', 3)}>${text.description}</p>` : ''}
    ${text.skills.length ? `<ul ${a('skills', 4)}>${text.skills.map((s) => `<li>${s}</li>`).join('')}</ul>` : ''}
  </div>
  ${ctx.avatar ? `<div ${a('pic', 1, 'r')}>${avatarImg(ctx)}</div>` : ''}
</div>
${socialList(ctx, 'socials', 5)}`;
  },
  css: (ctx) => {
    const pink = ctx.palette.border;
    const cyan = ctx.palette.accent;
    return `
.card{font-family:${family('Inter')}}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 40% 45%,${alpha(pink, 0.12)},transparent 55%),radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.6) 100%)}
.tube{position:absolute;inset:14px;border:2px solid #ffd3ec;border-radius:${Math.max(6, ctx.radius - 4)}px;box-shadow:0 0 4px ${pink},0 0 14px ${pink},0 0 28px ${alpha(pink, 0.5)},inset 0 0 8px ${alpha(pink, 0.7)};animation:cv-hum 5s linear infinite}
.sign{position:absolute;right:34px;top:30px;display:flex;align-items:center;gap:6px;font-family:${family('Tilt Neon', 'sans-serif')};font-size:12px;letter-spacing:.2em;color:#e9fdff;text-shadow:${glow(cyan)}}
.dot{width:7px;height:7px;border-radius:50%;background:#e9fdff;box-shadow:0 0 6px ${cyan},0 0 12px ${cyan};animation:cv-blink 1.6s steps(1) infinite}
@keyframes cv-blink{50%{opacity:.2}}
.layout{position:relative;display:flex;align-items:center;gap:30px;height:100%;padding:34px 44px 72px 46px}
.info{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start}
.name{font-family:${family('Tilt Neon', 'sans-serif')};font-weight:400;line-height:1.1;color:#fff0f8;text-shadow:${glow(pink)};margin-bottom:8px;animation:cv-flicker 6s linear infinite}
@keyframes cv-flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}20%,24%,55%{opacity:.55}}
@keyframes cv-hum{0%,100%{opacity:1}48%{opacity:.92}50%{opacity:.8}52%{opacity:.95}}
.role{font-family:${family('Tilt Neon', 'sans-serif')};font-size:15px;letter-spacing:.06em;color:#e9fdff;text-shadow:${glow(cyan)};margin-bottom:12px}
.desc{font-size:12.5px;line-height:1.55;color:var(--muted);-webkit-line-clamp:3}
.skills{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
.skills li{font-size:10.5px;font-weight:600;padding:2px 9px;border-radius:999px;color:#e9fdff;border:1px solid ${cyan};box-shadow:0 0 6px ${alpha(cyan, 0.6)},inset 0 0 4px ${alpha(cyan, 0.5)}}
.pic{width:138px;height:138px;flex:none;border-radius:50%;padding:4px;border:2px solid #ffd3ec;box-shadow:0 0 6px ${pink},0 0 18px ${pink},inset 0 0 6px ${pink}}
.pic:has(.shape-square),.pic:has(.shape-hexagon){border-radius:8px}
.pic:has(.shape-rounded){border-radius:26%}
.socials{position:absolute;left:46px;right:44px;bottom:30px;gap:6px 16px;font-size:11px;font-weight:600;color:var(--muted)}
.socials .icon{color:${cyan};filter:drop-shadow(0 0 3px ${cyan})}`;
  },
};
