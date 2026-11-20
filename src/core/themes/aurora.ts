import { family } from '../catalog/fonts.js';
import { splitBody } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { alpha } from '../utils.js';

export const aurora: ThemeRenderer = {
  body: (ctx) =>
    splitBody(ctx, {
      nameBase: 32,
      extra:
        '<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="glass"></div>',
    }),
  css: (ctx) => `
.card{font-family:${family('Inter')}}
.blob{position:absolute;border-radius:50%;filter:blur(46px);opacity:.75;animation:cv-drift 14s ease-in-out infinite alternate}
.b1{width:300px;height:220px;left:-70px;top:-90px;background:#7c3aed}
.b2{width:260px;height:240px;right:-60px;top:40px;background:#06b6d4;animation-duration:17s;animation-delay:-4s}
.b3{width:280px;height:180px;left:180px;bottom:-120px;background:#ec4899;animation-duration:19s;animation-delay:-8s}
@keyframes cv-drift{0%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,20px) scale(1.15)}100%{transform:translate(-30px,10px) scale(.95)}}
.glass{position:absolute;inset:14px;border-radius:${Math.max(0, ctx.radius - 8)}px;background:linear-gradient(140deg,rgba(255,255,255,.11),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 20px 60px rgba(0,0,0,.35)}
.layout{position:relative;display:flex;align-items:center;gap:26px;height:100%;padding:30px 40px 68px}
.info{flex:1;min-width:0;display:flex;flex-direction:column}
.name{font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:6px;background:linear-gradient(90deg,var(--text),${ctx.opts.colors.text ? 'var(--text)' : '#c4b5fd'});-webkit-background-clip:text;background-clip:text;color:transparent}
.role{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:8px}
.desc{font-size:13px;color:var(--muted);line-height:1.5;-webkit-line-clamp:3}
.divider{width:48px;height:2px;margin:12px 0 0;background:linear-gradient(90deg,var(--accent),transparent)}
.meta{gap:4px 14px;margin-top:10px;font-size:11.5px;color:var(--muted)}
.skills{gap:6px;margin-top:10px}
.skill{font-size:10.5px;font-weight:600;padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14)}
.avatar-wrap{width:136px;height:136px;flex:none;padding:3px;border-radius:50%;background:conic-gradient(from 180deg,#7c3aed,#06b6d4,#ec4899,#7c3aed);box-shadow:0 0 40px ${alpha(ctx.palette.accent, 0.35)}}
.avatar-wrap .avatar{border:3px solid ${ctx.background === 'transparent' ? '#0b1020' : 'var(--bg)'}}
.avatar-wrap:has(.shape-square),.avatar-wrap:has(.shape-hexagon){border-radius:0;background:none;padding:0;box-shadow:none}
.avatar-wrap:has(.shape-rounded){border-radius:24%}
.socials{position:absolute;left:40px;right:40px;bottom:28px;gap:6px 8px}
.social{font-size:11px;font-weight:600;padding:4px 10px 4px 8px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12)}`,
};
