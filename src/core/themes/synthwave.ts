import { family } from '../catalog/fonts.js';
import { a, avatarImg, nameStyle, socialList } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { alpha } from '../utils.js';

export const synthwave: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    return `
<div class="stars"></div>
<div class="sun"></div>
<div class="floor"><div class="grid"></div></div>
<div class="horizon"></div>
<div class="layout">
  <div class="info">
    <h1 class="name a a-l" ${nameStyle(ctx, 28, 15)}>${text.name}</h1>
    ${text.role ? `<p ${a('role', 1)}>${text.role}</p>` : ''}
    ${text.description ? `<p ${a('desc', 2)}>${text.description}</p>` : ''}
    ${text.skills.length ? `<p ${a('stack', 3)}>${text.skills.join(' // ')}</p>` : ''}
  </div>
  ${ctx.avatar ? `<div ${a('pic', 1, 'r')}>${avatarImg(ctx)}</div>` : ''}
</div>
${socialList(ctx, 'socials', 4)}`;
  },
  css: (ctx) => {
    const sky = ctx.customBackground
      ? 'var(--bg)'
      : 'linear-gradient(180deg,#0d0221 0%,#240b4d 48%,#5a1470 72%,#2a0a4a 72.2%,#14072b 100%)';
    const nameFill = ctx.opts.colors.text
      ? 'color:var(--text)'
      : 'background:linear-gradient(180deg,#ffffff 15%,#ffd1f5 45%,#ff4fd8 85%);-webkit-background-clip:text;background-clip:text;color:transparent';
    return `
.card{font-family:${family('Orbitron')};background:${sky}}
.stars{position:absolute;inset:0 0 40% 0;background-image:radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 70% 18%,#fff,transparent),radial-gradient(1.5px 1.5px at 45% 60%,#ffd1f5,transparent),radial-gradient(1px 1px at 88% 45%,#fff,transparent),radial-gradient(1px 1px at 10% 70%,#c4b5fd,transparent),radial-gradient(1px 1px at 58% 8%,#fff,transparent);opacity:.8}
.sun{position:absolute;right:40px;bottom:96px;width:200px;height:200px;border-radius:50%;background:linear-gradient(180deg,#ffe66d 8%,#ff8a5b 48%,#ff2fd2 92%);box-shadow:0 0 60px rgba(255,47,210,.45);
  -webkit-mask-image:linear-gradient(180deg,#000 0 52%,transparent 52% 57%,#000 57% 64%,transparent 64% 69%,#000 69% 75%,transparent 75% 81%,#000 81% 86%,transparent 86%);
  mask-image:linear-gradient(180deg,#000 0 52%,transparent 52% 57%,#000 57% 64%,transparent 64% 69%,#000 69% 75%,transparent 75% 81%,#000 81% 86%,transparent 86%)}
.floor{position:absolute;left:0;right:0;bottom:0;height:96px;overflow:hidden;perspective:300px;perspective-origin:50% 0%}
.grid{position:absolute;left:-60%;right:-60%;top:0;height:140px;transform-origin:50% 0;transform:rotateX(60deg);
  background-image:linear-gradient(${alpha(ctx.palette.border, 0.9)} 2px,transparent 2px),linear-gradient(90deg,${alpha(ctx.palette.border, 0.9)} 2px,transparent 2px);background-size:44px 44px;animation:cv-grid 1.4s linear infinite}
@keyframes cv-grid{to{background-position:0 44px}}
.horizon{position:absolute;left:0;right:0;bottom:95px;height:2px;background:var(--border);box-shadow:0 0 12px 2px ${alpha(ctx.palette.border, 0.8)}}
.layout{position:relative;display:flex;align-items:flex-start;gap:20px;height:100%;padding:30px 36px 0}
.info{flex:1;min-width:0;display:flex;flex-direction:column}
.name{font-weight:900;line-height:1.1;letter-spacing:.04em;text-transform:uppercase;${nameFill};filter:drop-shadow(0 0 10px rgba(255,47,210,.55));margin-bottom:8px}
.role{font-size:11px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);text-shadow:0 0 8px ${alpha(ctx.palette.accent, 0.8)};margin-bottom:10px}
.desc{font-size:10.5px;font-weight:500;line-height:1.65;color:var(--muted);-webkit-line-clamp:3;max-width:330px}
.stack{margin-top:8px;font-size:9.5px;font-weight:500;letter-spacing:.08em;color:#ffe66d}
.pic{width:118px;height:118px;flex:none;margin:12px 40px 0 0;border-radius:50%;padding:3px;background:linear-gradient(135deg,var(--accent),#ff2fd2);box-shadow:0 0 24px rgba(255,47,210,.6),0 0 6px ${alpha(ctx.palette.accent, 0.8)}}
.pic:has(.shape-square),.pic:has(.shape-hexagon){border-radius:0}
.pic:has(.shape-rounded){border-radius:24%}
.socials{position:absolute;left:36px;right:36px;bottom:16px;gap:6px}
.social{font-size:9.5px;font-weight:500;letter-spacing:.04em;padding:5px 10px 5px 8px;border-radius:4px;background:rgba(13,2,33,.72);border:1px solid ${alpha(ctx.palette.border, 0.6)};color:var(--text)}`;
  },
};
