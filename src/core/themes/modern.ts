import { family } from '../catalog/fonts.js';
import type { ThemeRenderer } from '../types.js';
import { alpha } from '../utils.js';

export const modern: ThemeRenderer = {
  css: (ctx) => {
    const glow = ctx.customBackground
      ? 'var(--bg)'
      : `radial-gradient(circle at 100% 0%,${alpha(ctx.palette.accent, 0.16)},transparent 46%),radial-gradient(circle at 0% 110%,rgba(236,72,153,.12),transparent 42%),var(--bg)`;
    return `
.card{font-family:${family('Inter')};background:${glow};box-shadow:inset 0 0 0 1px var(--border)}
.layout{position:relative;display:flex;flex-direction:row-reverse;align-items:center;gap:30px;height:100%;padding:26px 34px 64px}
.info{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start}
.name{font-weight:800;letter-spacing:-.025em;line-height:1.1;margin-bottom:8px}
.role{font-size:11.5px;font-weight:600;color:var(--accent);background:${alpha(ctx.palette.accent, 0.1)};border:1px solid ${alpha(ctx.palette.accent, 0.25)};padding:3px 10px;border-radius:999px;margin-bottom:10px}
.desc{font-size:13px;color:var(--muted);line-height:1.5;-webkit-line-clamp:3}
.divider{display:none}
.meta{gap:4px 14px;margin-top:10px;font-size:11.5px;color:var(--muted)}
.skills{gap:6px;margin-top:10px}
.skill{font-size:10.5px;font-weight:600;padding:3px 9px;border-radius:7px;background:var(--surface);color:var(--text)}
.avatar-wrap{width:140px;height:140px;flex:none;padding:4px;border-radius:30%;background:linear-gradient(135deg,var(--accent),#ec4899);box-shadow:0 18px 40px -12px ${alpha(ctx.palette.accent, 0.55)}}
.avatar-wrap .shape-circle{border:3px solid var(--bg)}
.avatar-wrap:has(.shape-circle){border-radius:50%}
.avatar-wrap .avatar:not(.shape-circle){border-radius:26%}
.socials{position:absolute;left:34px;right:34px;bottom:20px;gap:6px}
.social{font-size:11px;font-weight:600;padding:5px 10px 5px 8px;border-radius:999px;background:var(--surface);border:1px solid var(--border)}`;
  },
};
