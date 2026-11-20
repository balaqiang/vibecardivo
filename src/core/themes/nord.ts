import { family } from '../catalog/fonts.js';
import type { ThemeRenderer } from '../types.js';

export const nord: ThemeRenderer = {
  css: () => `
.card{font-family:${family('Inter')}}
.card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:linear-gradient(#8fbcbb,#88c0d0,#81a1c1,#5e81ac)}
.layout{position:relative;display:flex;align-items:center;gap:28px;height:100%;padding:28px 38px 62px 44px}
.info{flex:1;min-width:0;display:flex;flex-direction:column}
.name{font-weight:600;letter-spacing:-.01em;line-height:1.15;margin-bottom:6px}
.role{font-size:13px;color:var(--accent);margin-bottom:10px}
.desc{font-size:13px;line-height:1.55;color:var(--muted);-webkit-line-clamp:3}
.divider{display:none}
.meta{gap:4px 14px;margin-top:12px;font-size:11.5px;color:var(--muted)}
.skills{gap:6px;margin-top:12px}
.skill{font-size:10.5px;padding:3px 9px;border-radius:6px;background:var(--surface);color:#e5e9f0;border:1px solid var(--border)}
.avatar-wrap{width:132px;height:132px;flex:none;padding:4px;border-radius:50%;border:2px solid var(--accent)}
.avatar-wrap:has(.shape-square),.avatar-wrap:has(.shape-hexagon){border:none;padding:0}
.avatar-wrap:has(.shape-rounded){border-radius:26%}
.socials{position:absolute;left:44px;right:38px;bottom:22px;gap:6px}
.social{font-size:11px;padding:4px 10px 4px 8px;border-radius:6px;background:var(--surface)}`,
};
