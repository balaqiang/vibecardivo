import { family } from '../catalog/fonts.js';
import { a, avatarImg } from '../layout.js';
import type { RenderContext, ThemeRenderer } from '../types.js';
import { alpha, esc, fitSize } from '../utils.js';

/** Unix-ish login for the prompt: GitHub handle, else a slug of the name. */
export const loginName = (ctx: RenderContext): string => {
  const gh = ctx.socials.find((s) => s.platform.id === 'github')?.handle;
  const slug = (gh ?? ctx.opts.name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 16);
  return slug || 'guest';
};

const prompt = (cmd: string) =>
  `<span class="ps">➜</span> <span class="cwd">~</span> <span class="cmd">${cmd}</span>`;

export const hacker: ThemeRenderer = {
  body: (ctx) => {
    const { text } = ctx;
    const user = loginName(ctx);
    let i = 0;
    const line = (cls: string, html: string) => `<p ${a(`ln ${cls}`, i++)}>${html}</p>`;

    const whoami = [text.role, text.location && `@ ${text.location}`].filter(Boolean).join(' ');
    const links = [
      ...ctx.socials.map(
        (s) => `<span class="lk"><b>${s.platform.short}</b>/${esc(s.handle)}</span>`,
      ),
      ...(text.site ? [`<span class="lk"><b>web</b>/${text.site}</span>`] : []),
    ];

    const rows = [
      line('', prompt('whoami')),
      line(
        'out name',
        `<span style="font-size:${fitSize(ctx.opts.name, 22, 18)}px">${text.name}</span>`,
      ),
      whoami ? line('out dim', whoami) : '',
      text.description ? line('', prompt('cat about.txt')) : '',
      text.description
        ? line(`out desc${text.skills.length ? ' short' : ''}`, text.description)
        : '',
      text.skills.length ? line('', prompt('echo $STACK')) : '',
      text.skills.length ? line('out stack', text.skills.map((s) => `[${s}]`).join(' ')) : '',
      links.length ? line('', prompt('ls ./links')) : '',
      links.length ? line('out links', links.join('')) : '',
      line('', `${prompt('')}<span class="cursor"></span>`),
    ];

    return `
<div class="term">
  <div class="bar"><i></i><i></i><i></i><span class="title">${esc(user)}@vibecard: ~</span></div>
  <div class="term-body">
    <div class="term-text">${rows.join('')}</div>
    ${ctx.avatar ? `<div ${a('pic', 0, 'r')}>${avatarImg(ctx)}<div class="scan"></div></div>` : ''}
  </div>
</div>`;
  },
  css: (ctx) => `
.card{font-family:${family('JetBrains Mono', 'monospace')};background:${ctx.customBackground ? 'var(--bg)' : `radial-gradient(ellipse at 50% 40%,${alpha(ctx.palette.accent, 0.08)},transparent 70%),var(--bg)`}}
.term{position:relative;display:flex;flex-direction:column;height:100%}
.bar{display:flex;align-items:center;gap:6px;height:28px;padding:0 12px;background:var(--surface);border-bottom:1px solid var(--border);flex:none}
.bar i{width:10px;height:10px;border-radius:50%;background:#ff5f56}
.bar i:nth-child(2){background:#ffbd2e}
.bar i:nth-child(3){background:#27c93f}
.title{flex:1;text-align:center;margin-right:46px;font-size:11px;color:var(--muted)}
.term-body{flex:1;display:flex;gap:18px;padding:12px 18px 12px;min-height:0}
.term-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;font-size:11.5px;line-height:1.45}
.ln{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ps{color:var(--accent);font-weight:700}
.cwd{color:#5ccfe6}
.cmd{color:var(--text)}
.out{color:var(--text);padding-left:2px}
.name{font-weight:700;line-height:1.25;text-shadow:0 0 10px ${alpha(ctx.palette.accent, 0.6)}}
.dim{color:var(--muted)}
.desc{white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;color:${ctx.opts.colors.text ? 'var(--text)' : '#b9f5c9'}}
.desc.short{-webkit-line-clamp:2}
.stack{color:#ffd866}
.links{white-space:normal;display:flex;flex-wrap:wrap;gap:0 14px}
.lk{white-space:nowrap}
.lk b{color:var(--muted);font-weight:400}
.cursor{display:inline-block;width:8px;height:14px;margin-left:2px;vertical-align:-2px;background:var(--accent);animation:cv-blink 1s steps(1) infinite}
@keyframes cv-blink{50%{opacity:0}}
.pic{position:relative;width:126px;height:126px;flex:none;align-self:center;border:1px solid var(--border);padding:4px;background:${alpha(ctx.palette.accent, 0.04)}}
.pic .avatar{filter:grayscale(1) sepia(1) hue-rotate(68deg) saturate(3.2) brightness(.9) contrast(1.15)}
.scan{position:absolute;inset:4px;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px);pointer-events:none}
.pic::after{content:'';position:absolute;left:4px;right:4px;height:22px;top:4px;background:linear-gradient(${alpha(ctx.palette.accent, 0)},${alpha(ctx.palette.accent, 0.25)},${alpha(ctx.palette.accent, 0)});animation:cv-sweep 3.2s linear infinite}
@keyframes cv-sweep{from{transform:translateY(0)}to{transform:translateY(96px)}}`,
};
