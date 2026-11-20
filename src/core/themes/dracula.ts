import { family } from '../catalog/fonts.js';
import { a, avatarImg } from '../layout.js';
import type { RenderContext, ThemeRenderer } from '../types.js';
import { esc, toAscii, wrap } from '../utils.js';

const MAX_LINES = 11;

/** `"Satya Wikananda"` → `satyaWikananda` (a valid JS identifier). */
export const identifier = (name: string): string => {
  const words = toAscii(name)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const id = words.map((w, i) => (i ? w[0]?.toUpperCase() + w.slice(1) : w)).join('');
  return /^[a-z_$]/.test(id) ? id : `dev${id}`;
};

const str = (s: string) => `<span class="s">${esc(JSON.stringify(s))}</span>`;
const prop = (key: string, value: string, comma = true) =>
  `  <span class="p">${esc(key)}</span><span class="o">:</span> ${value}${comma ? '<span class="o">,</span>' : ''}`;

function codeLines(ctx: RenderContext, budget: number): string[] {
  const o = ctx.opts;
  const body: string[] = [];
  if (o.role) body.push(prop('role', str(o.role)));
  if (o.location) body.push(prop('location', str(o.location)));
  if (o.description) {
    const parts = wrap(o.description, 40, 3);
    if (parts.length === 1) body.push(prop('bio', str(parts[0] ?? '')));
    else {
      body.push(
        `  <span class="p">bio</span><span class="o">:</span> ${str(`${parts[0]} `)} <span class="o">+</span>`,
      );
      parts.slice(1).forEach((part, i) => {
        const last = i === parts.length - 2;
        body.push(
          `    ${str(last ? part : `${part} `)}${last ? '<span class="o">,</span>' : ' <span class="o">+</span>'}`,
        );
      });
    }
  }
  if (o.skills.length) {
    const list = o.skills.slice(0, 4).map(str).join('<span class="o">, </span>');
    body.push(prop('stack', `<span class="o">[</span>${list}<span class="o">]</span>`));
  }
  if (o.site) body.push(prop('site', str(o.site)));
  for (const s of ctx.socials) body.push(prop(s.platform.id, str(s.handle)));
  return body.slice(0, budget);
}

export const dracula: ThemeRenderer = {
  body: (ctx) => {
    const ident = identifier(ctx.opts.name);
    const lines = [
      `<span class="k">const</span> <span class="v">${esc(ident)}</span> <span class="o">=</span> <span class="o">{</span>`,
      prop('name', str(ctx.opts.name)),
      ...codeLines(ctx, MAX_LINES - 3),
      '<span class="o">}</span> <span class="k">satisfies</span> <span class="t">Developer</span><span class="o">;</span>',
    ];
    const ol = lines.map((l, i) => `<li ${a('ln', i)}>${l}</li>`).join('');
    return `
<div class="editor">
  <div class="tabs"><span class="dots"><i></i><i></i><i></i></span><span class="tab on">${esc(ident)}.ts</span><span class="tab">README.md</span></div>
  <div class="main">
    <ol class="code">${ol}</ol>
    ${ctx.avatar ? `<div ${a('side', 1, 'r')}>${avatarImg(ctx)}<span class="cap">${esc(ident)}.png</span></div>` : ''}
  </div>
  <div class="status"><span>⎇ main</span><span>TypeScript</span><span>UTF-8</span><span class="ok">✓ 0 problems</span></div>
</div>`;
  },
  css: (ctx) => `
.card{font-family:${family('JetBrains Mono', 'monospace')}}
.editor{position:relative;display:flex;flex-direction:column;height:100%}
.tabs{display:flex;align-items:flex-end;gap:2px;height:32px;padding:0 12px;background:var(--surface);flex:none}
.dots{display:flex;gap:6px;align-self:center;margin-right:12px}
.dots i{width:10px;height:10px;border-radius:50%;background:#ff5555}
.dots i:nth-child(2){background:#f1fa8c}
.dots i:nth-child(3){background:#50fa7b}
.tab{font-size:10.5px;padding:7px 12px;color:var(--muted);border-radius:6px 6px 0 0}
.tab.on{background:var(--bg);color:var(--text);box-shadow:inset 0 2px 0 var(--accent)}
.main{flex:1;display:flex;gap:16px;padding:10px 18px 6px 0;min-height:0}
.code{flex:1;min-width:0;counter-reset:ln;font-size:11.5px;line-height:19px;list-style:none}
.ln{counter-increment:ln;white-space:pre;overflow:hidden;text-overflow:ellipsis}
.ln::before{content:counter(ln);display:inline-block;width:38px;padding-right:14px;text-align:right;color:var(--border)}
.ln:first-child{background:${ctx.palette.border}55}
.k{color:#ff79c6}
.v{color:#50fa7b}
.p{color:#8be9fd}
.s{color:#f1fa8c}
.t{color:#8be9fd;font-style:italic}
.o{color:var(--text)}
.side{width:118px;flex:none;display:flex;flex-direction:column;align-items:center;gap:6px;padding-top:6px}
.side .avatar{width:118px;height:118px;border:1px solid var(--border)}
.cap{font-size:9.5px;color:var(--muted)}
.status{display:flex;gap:16px;align-items:center;height:22px;padding:0 14px;background:var(--accent);color:var(--surface);font-size:9.5px;flex:none}
.status .ok{margin-left:auto}`,
};
