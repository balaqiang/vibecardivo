import { family } from '../catalog/fonts.js';
import type { ThemeRenderer } from '../types.js';

/** A faithful, tidied-up take on the original Cardivo card. */
export const classic: ThemeRenderer = {
  css: () => `
.card{font-family:${family('Montserrat')}}
.layout{position:relative;display:flex;align-items:center;justify-content:center;height:100%;padding:24px 32px 44px}
.info{display:flex;flex-direction:column;width:70%}
.name{font-weight:700;line-height:1.15;margin-bottom:6px}
.role{font-size:13px;font-weight:700;color:var(--accent);margin-bottom:6px}
.desc{font-size:12.8px;margin-bottom:12px}
.divider{width:100%;border-bottom:1px solid var(--border)}
.meta{gap:4px 14px;margin-top:10px;font-size:12px}
.skills{gap:6px;margin-top:10px}
.skill{font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--surface);border:1px solid var(--border)}
.avatar-wrap{width:150px;height:150px;flex:none;margin:2% 0 0 4%}
.socials{position:absolute;left:0;right:0;bottom:14px;justify-content:center;gap:4px 16px;font-size:11px}`,
};
