import { family } from '../catalog/fonts.js';
import { a, avatarImg, nameStyle } from '../layout.js';
import type { ThemeRenderer } from '../types.js';
import { esc } from '../utils.js';

export const editorial: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    const [first = '', ...rest] = [...ctx.opts.description];
    const story = first ? `<span class="drop">${esc(first)}</span>${esc(rest.join(''))}` : '';
    const links = ctx.socials
      .map((s) => `<span class="lk"><b>${esc(s.platform.label)}</b> ${esc(s.handle)}</span>`)
      .join('<span class="dot">·</span>');
    return `
<div class="paper">
  <header ${a('mast', 0)}>
    <span>Vol. II · No. 1</span>
    <span class="title">The Daily Profile</span>
    <span>${text.location || 'Worldwide Edition'}</span>
  </header>
  <div class="cols">
    <article class="story">
      <h1 class="name a a-l" ${nameStyle(ctx, 40, 15, 1)}>${text.name}</h1>
      ${text.role ? `<p ${a('deck', 2)}>${text.role}</p>` : ''}
      ${story ? `<p ${a('body', 3)}>${story}</p>` : ''}
      ${
        text.skills.length || text.site
          ? `<p ${a('topics', 4)}><span>${text.skills.length ? `<b>Topics:</b> ${text.skills.join(' · ')}` : ''}</span>${text.site ? `<span class="site">${text.site}</span>` : ''}</p>`
          : ''
      }
    </article>
    ${
      ctx.avatar
        ? `<figure ${a('fig', 1, 'r')}><div class="frame">${avatarImg(ctx)}</div><figcaption>Fig. 1 — ${text.name}</figcaption></figure>`
        : ''
    }
  </div>
  ${links ? `<footer ${a('links', 5, 'u')}><span class="find">Find me</span>${links}</footer>` : ''}
</div>`;
  },
  css: () => `
.card{font-family:${family('Lora', 'serif')}}
.paper{position:relative;display:flex;flex-direction:column;height:100%;padding:16px 26px 14px}
.mast{display:flex;align-items:baseline;justify-content:space-between;padding-bottom:6px;border-bottom:3px double var(--border);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.title{font-family:${family('Playfair Display', 'serif')};font-style:italic;font-size:15px;letter-spacing:.02em;text-transform:none;color:var(--text)}
.cols{display:flex;gap:20px;flex:1;min-height:0;padding-top:12px}
.story{flex:1;min-width:0;display:flex;flex-direction:column}
.name{font-family:${family('Playfair Display', 'serif')};font-weight:900;line-height:1;letter-spacing:-.01em;margin-bottom:6px}
.deck{font-family:${family('Playfair Display', 'serif')};font-style:italic;font-size:14px;color:var(--accent);margin-bottom:8px}
.body{font-size:12px;line-height:18px;max-height:72px;overflow:hidden;text-align:justify;hyphens:auto}
.drop{float:left;font-family:${family('Playfair Display', 'serif')};font-weight:900;font-size:44px;line-height:36px;padding:2px 6px 0 0;color:var(--accent)}
.topics{margin-top:auto;padding-top:6px;font-size:10px;color:var(--muted);display:flex;justify-content:space-between;gap:10px}
.topics b{color:var(--text)}
.site{font-style:italic}
.fig{width:138px;flex:none;display:flex;flex-direction:column;gap:5px}
.frame{width:138px;height:150px;border:1px solid var(--border);padding:3px;background:var(--surface)}
.frame .avatar{border-radius:0;clip-path:none;filter:grayscale(1) contrast(1.1) sepia(.15)}
figcaption{font-size:9px;font-style:italic;color:var(--muted);line-height:1.3}
.links{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 6px;padding-top:7px;margin-top:8px;border-top:1px solid var(--border);font-size:10px;color:var(--muted)}
.find{font-family:${family('Playfair Display', 'serif')};font-style:italic;color:var(--text);margin-right:4px}
.lk b{font-weight:400;color:var(--text);text-transform:uppercase;font-size:8.5px;letter-spacing:.1em}
.dot{opacity:.5}`,
};
