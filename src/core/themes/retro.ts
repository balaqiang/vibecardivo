import { family } from '../catalog/fonts.js';
import { a, avatarImg, metaLine, nameStyle, socialList } from '../layout.js';
import type { ThemeRenderer } from '../types.js';

/** Outer → inner stripe colours of the 70s rainbow. */
const STRIPES = ['#a33c1e', '#d9541e', '#e8a33d', '#6b8e4e'];

export const retro: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    return `
${ctx.avatar ? '<div class="arch"></div>' : ''}
<div class="layout">
  <div class="info">
    ${text.role ? `<p ${a('role', 0)}>${text.role}</p>` : ''}
    <h1 class="name a a-l" ${nameStyle(ctx, 34, 13, 1)}>${text.name}</h1>
    ${text.description ? `<p ${a('desc', 2)}>${text.description}</p>` : ''}
    ${metaLine(ctx, 'meta', 3)}
    ${text.skills.length ? `<ul ${a('skills', 4)}>${text.skills.map((s) => `<li>${s}</li>`).join('')}</ul>` : ''}
  </div>
  ${ctx.avatar ? `<div ${a('pic', 1, 'r')}>${avatarImg(ctx)}</div>` : ''}
</div>
${socialList(ctx, 'socials', 5)}
<div class="band"></div>`;
  },
  css: () => {
    const [s1, s2, s3, s4] = STRIPES;
    const rings = `radial-gradient(circle,transparent 0 80px,${s4} 80px 97px,${s3} 97px 114px,${s2} 114px 131px,${s1} 131px 148px,transparent 148px)`;
    return `
.card{font-family:${family('Quicksand')}}
.arch{position:absolute;left:378px;top:-28px;width:300px;height:300px;background:${rings};clip-path:inset(0 0 50% 0)}
.layout{position:relative;display:flex;align-items:flex-start;gap:20px;height:100%;padding:30px 40px 76px 38px}
.info{flex:1;min-width:0;max-width:330px;display:flex;flex-direction:column;align-items:flex-start}
.role{font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);margin-bottom:6px}
.name{font-family:${family('Shrikhand', 'serif')};font-weight:400;line-height:1.05;color:var(--text);text-shadow:3px 3px 0 var(--accent);margin-bottom:12px}
.desc{font-size:13px;font-weight:500;line-height:1.5;color:var(--muted);-webkit-line-clamp:3}
.meta{gap:4px 14px;margin-top:10px;font-size:11.5px;font-weight:700;color:var(--muted)}
.skills{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.skills li{font-size:11px;font-weight:700;padding:3px 11px;border:2px solid var(--border);border-radius:999px;background:var(--surface)}
.pic{position:absolute;left:458px;top:52px;width:140px;height:140px;border-radius:50%;padding:5px;background:var(--border)}
.pic:has(.shape-square),.pic:has(.shape-hexagon){border-radius:6px}
.pic:has(.shape-rounded){border-radius:28%}
.socials{position:absolute;left:38px;right:40px;bottom:34px;gap:6px 16px;font-size:11.5px;font-weight:700}
.band{position:absolute;left:0;right:0;bottom:0;height:20px;background:linear-gradient(${s3} 0 25%,${s2} 25% 50%,${s1} 50% 75%,${s4} 75%)}`;
  },
};
