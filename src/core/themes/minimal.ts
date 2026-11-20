import { family } from '../catalog/fonts.js';
import { a, avatarImg, metaLine, nameStyle, socialList } from '../layout.js';
import type { ThemeRenderer } from '../types.js';

export const minimal: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    return `
<div class="mn">
  <header class="mn-head">
    ${ctx.avatar ? `<div ${a('pfp', 0)}>${avatarImg(ctx)}</div>` : ''}
    <div class="mn-title">
      <h1 class="name a a-l" ${nameStyle(ctx, 28, 24)}>${text.name}</h1>
      ${text.role ? `<p ${a('role', 1)}>${text.role}</p>` : ''}
    </div>
  </header>
  ${text.description ? `<p ${a('desc', 2)}>${text.description}</p>` : ''}
  ${text.skills.length ? `<p ${a('stack', 3)}>${text.skills.join('<span class="sep">/</span>')}</p>` : ''}
  <footer class="mn-foot">
    ${metaLine(ctx, 'meta', 4)}
    ${socialList(ctx, 'socials', 5)}
  </footer>
</div>`;
  },
  css: () => `
.card{font-family:${family('Inter')};box-shadow:inset 0 0 0 1px var(--border)}
.mn{position:relative;display:flex;flex-direction:column;height:100%;padding:34px 42px 30px}
.mn-head{display:flex;align-items:center;gap:18px;margin-bottom:18px}
.pfp{width:64px;height:64px;flex:none}
.mn-title{min-width:0}
.name{font-weight:600;letter-spacing:-.03em;line-height:1.1}
.role{font-size:13px;color:var(--muted);margin-top:4px}
.desc{font-size:14px;line-height:1.6;max-width:520px;-webkit-line-clamp:3}
.stack{margin-top:12px;font-size:11.5px;color:var(--muted);letter-spacing:.02em}
.sep{margin:0 8px;opacity:.5}
.mn-foot{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding-top:14px;border-top:1px solid var(--border)}
.meta{gap:4px 14px;font-size:11.5px;color:var(--muted)}
.meta .icon{color:var(--muted)}
.socials{gap:6px 14px;justify-content:flex-end;font-size:11.5px;color:var(--muted)}
.socials .icon{width:13px;height:13px}`,
};
