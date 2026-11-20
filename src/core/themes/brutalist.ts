import { family } from '../catalog/fonts.js';
import { a, avatarImg, metaLine, nameStyle, socialList } from '../layout.js';
import type { ThemeRenderer } from '../types.js';

const TAG_COLORS = ['#ff90e8', '#90f7ff', '#b4ff90', '#ffc490', '#c4b5fd', '#ffffff'];

export const brutalist: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    const skills = text.skills
      .map(
        (s, i) =>
          `<li class="skill" style="background:${TAG_COLORS[i % TAG_COLORS.length]};transform:rotate(${i % 2 ? 2 : -2}deg)">${s}</li>`,
      )
      .join('');
    return `
<div class="panel">
  <div class="layout">
    <div class="info">
      ${text.role ? `<p ${a('tag', 0)}>${text.role}</p>` : ''}
      <h1 class="name a a-l" ${nameStyle(ctx, 38, 13, 1)}>${text.name}</h1>
      ${text.description ? `<p ${a('desc', 2)}>${text.description}</p>` : ''}
      ${metaLine(ctx, 'meta', 3)}
      ${skills ? `<ul ${a('skills', 4)}>${skills}</ul>` : ''}
    </div>
    ${ctx.avatar ? `<div ${a('pic', 1, 'r')}>${avatarImg(ctx)}<span class="sticker">hi!</span></div>` : ''}
  </div>
  ${socialList(ctx, 'socials', 5)}
</div>`;
  },
  css: () => `
.card{font-family:${family('Space Grotesk')}}
.panel{position:absolute;inset:16px 22px 22px 16px;background:var(--surface);border:3px solid var(--border);box-shadow:7px 7px 0 var(--border);display:flex;flex-direction:column;padding:18px 22px 14px}
.layout{display:flex;gap:20px;align-items:flex-start;flex:1;min-height:0}
.info{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start}
.tag{display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:var(--border);color:var(--bg);padding:3px 8px;margin-bottom:8px;rotate:-1.5deg}
.name{font-weight:700;text-transform:uppercase;line-height:.95;letter-spacing:-.02em;margin-bottom:10px}
.desc{font-size:12.5px;font-weight:500;line-height:1.45;-webkit-line-clamp:3}
.meta{gap:4px 14px;margin-top:8px;font-size:11px;font-weight:700}
.skills{gap:7px;margin-top:10px;padding-left:2px}
.skill{font-size:10.5px;font-weight:700;padding:2px 8px;border:2px solid var(--border);box-shadow:2px 2px 0 var(--border);color:#000}
.pic{position:relative;width:124px;height:124px;flex:none;border:3px solid var(--border);box-shadow:5px 5px 0 var(--border);background:var(--bg);margin:2px 4px 0 0}
.pic .avatar{border-radius:0;clip-path:none}
.sticker{position:absolute;right:-16px;top:-14px;width:42px;height:42px;border-radius:50%;background:#ff90e8;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;transform:rotate(12deg);color:#000}
.socials{gap:8px;margin-top:10px}
.social{font-size:11px;font-weight:700;padding:3px 8px 3px 6px;border:2px solid var(--border);background:var(--bg);box-shadow:2px 2px 0 var(--border)}`,
};
