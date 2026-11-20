import { type IconDef, UI_ICONS } from './catalog/platforms.js';
import type { RenderContext, SocialLink } from './types.js';
import { esc, fitSize } from './utils.js';

export const WIDTH = 640;
export const HEIGHT = 320;

/* ------------------------------------------------------------------ pieces */

/** Inline SVG icon. Nested `<svg>` inside XHTML needs its own namespace. */
export function icon(def: IconDef, className = 'icon'): string {
  const paint = def.stroke
    ? 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
    : 'fill="currentColor"';
  return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" viewBox="0 0 24 24" ${paint} aria-hidden="true"><path d="${def.path}"/></svg>`;
}

/**
 * Class + inline style for an element taking part in the entrance animation.
 * `--i` staggers the delay; the direction picks the slide side for the `slide` preset.
 */
export const a = (cls: string, i: number, dir: 'l' | 'r' | 'u' = 'l'): string =>
  `class="${cls} a a-${dir}" style="--i:${i}"`;

export function avatarImg(ctx: RenderContext, cls = 'avatar'): string {
  if (!ctx.avatar) return '';
  return `<img class="${cls} shape-${ctx.shape}" src="${ctx.avatar.src}" alt="${ctx.text.name}"/>`;
}

export const socialHandle = (s: SocialLink): string => esc(s.handle);

export function socialList(ctx: RenderContext, cls = 'socials', i = 6): string {
  if (!ctx.socials.length) return '';
  const items = ctx.socials
    .map((s) => `<li class="social">${icon(s.platform.icon)}<span>${socialHandle(s)}</span></li>`)
    .join('');
  return `<ul ${a(cls, i, 'u')}>${items}</ul>`;
}

export function skillList(ctx: RenderContext, cls = 'skills', i = 5): string {
  if (!ctx.text.skills.length) return '';
  return `<ul ${a(cls, i)}>${ctx.text.skills.map((s) => `<li class="skill">${s}</li>`).join('')}</ul>`;
}

/** "🌐 site · 📍 location" line, `''` when both are empty. */
export function metaLine(ctx: RenderContext, cls = 'meta', i = 4): string {
  const parts = [
    ctx.text.site && `<span class="meta-item">${icon(UI_ICONS.globe)}${ctx.text.site}</span>`,
    ctx.text.location && `<span class="meta-item">${icon(UI_ICONS.pin)}${ctx.text.location}</span>`,
  ].filter(Boolean);
  return parts.length ? `<p ${a(cls, i)}>${parts.join('')}</p>` : '';
}

/** Inline style that shrinks long names. */
export const nameStyle = (ctx: RenderContext, base: number, maxChars: number, i = 0): string =>
  `style="--i:${i};font-size:${fitSize(ctx.opts.name, base, maxChars)}px"`;

/* ----------------------------------------------------------- split layout */

/**
 * The shared layout most themes build on: text on the left, avatar on the right,
 * social links along the bottom. Themes restyle it purely through CSS.
 */
export function splitBody(
  ctx: RenderContext,
  opts: { nameBase?: number; nameChars?: number; extra?: string } = {},
): string {
  const { text } = ctx;
  return `
${opts.extra ?? ''}
<div class="layout">
  <div class="info">
    <h1 class="name a a-l" ${nameStyle(ctx, opts.nameBase ?? 32, opts.nameChars ?? 20)}>${text.name}</h1>
    ${text.role ? `<p ${a('role', 1)}>${text.role}</p>` : ''}
    ${text.description ? `<p ${a('desc', 2)}>${text.description}</p>` : ''}
    <div ${a('divider', 3)}></div>
    ${metaLine(ctx)}
    ${skillList(ctx)}
  </div>
  ${ctx.avatar ? `<div ${a('avatar-wrap', 1, 'r')}>${avatarImg(ctx)}</div>` : ''}
</div>
${socialList(ctx)}`;
}

/* ---------------------------------------------------------------- base css */

/** Reset, shared component styles and the animation presets. */
export function baseCss(ctx: RenderContext): string {
  const p = ctx.palette;
  return `
.root,.root *{box-sizing:border-box;margin:0;padding:0}
.root{width:${WIDTH}px;height:${HEIGHT}px}
.card{--bg:${ctx.background};--text:${p.text};--muted:${p.muted};--accent:${p.accent};--surface:${p.surface};--border:${p.border};
  position:relative;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;border-radius:${ctx.radius}px;
  background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.35}
.card ul{list-style:none}
.pattern{position:absolute;inset:0;pointer-events:none}
.icon{width:14px;height:14px;flex:none;color:var(--accent)}
.avatar{display:block;object-fit:cover;width:100%;height:100%}
.shape-circle{border-radius:50%}
.shape-rounded{border-radius:22%}
.shape-square{border-radius:0}
.shape-hexagon{clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)}
.meta,.socials,.skills{display:flex;flex-wrap:wrap;align-items:center}
.meta-item,.social{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.meta-item .icon{width:12px;height:12px}
.desc{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}
${animationCss(ctx)}
@media (prefers-reduced-motion:reduce){.card *,.card *::before,.card *::after{animation:none!important;transition:none!important}}`;
}

function animationCss(ctx: RenderContext): string {
  const delay = 'animation-delay:calc(var(--i,0) * 110ms)';
  switch (ctx.animation) {
    case 'slide':
      // The original Cardivo entrance: text slides in from the left, avatar from the right.
      return `
.a-l{animation:cv-slide-l 1.6s cubic-bezier(.22,1,.36,1) both}
.a-r{animation:cv-slide-r 1.6s cubic-bezier(.22,1,.36,1) both}
.a-u{animation:cv-fade-up 1s ease 1s both}
@keyframes cv-slide-l{from{transform:translateX(-${WIDTH / 2}px);opacity:0}to{transform:none;opacity:1}}
@keyframes cv-slide-r{from{transform:translateX(${WIDTH / 2}px);opacity:0}to{transform:none;opacity:1}}
@keyframes cv-fade-up{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}`;
    case 'fade':
      return `
.a{animation:cv-fade .9s cubic-bezier(.22,1,.36,1) both;${delay}}
@keyframes cv-fade{from{opacity:0;transform:translateY(8px);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}`;
    case 'pop':
      return `
.a{animation:cv-pop .6s cubic-bezier(.34,1.56,.64,1) both;${delay}}
@keyframes cv-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}`;
    case 'type':
      return `
.a{animation:cv-type .7s steps(24,end) both;${delay.replace('110ms', '260ms')}}
@keyframes cv-type{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}`;
    case 'none':
      return '.card *,.card *::before,.card *::after{animation:none!important;transition:none!important}';
  }
}

/* -------------------------------------------------------------- svg shell */

export function svgDocument(ctx: RenderContext, inner: string, css: string): string {
  const { text } = ctx;
  const label = text.role ? `${text.name} — ${text.role}` : text.name;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(WIDTH * 1.53125)}" height="${Math.round(HEIGHT * 1.53125)}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="cv-title cv-desc">
<title id="cv-title">${label}</title>
<desc id="cv-desc">${text.description || `${text.name}'s profile card`}</desc>
<style><![CDATA[${css}]]></style>
<foreignObject x="0" y="0" width="${WIDTH}" height="${HEIGHT}">
<div xmlns="http://www.w3.org/1999/xhtml" class="root">
<div class="card theme-${ctx.theme.id}">
${ctx.pattern ? '<div class="pattern"></div>' : ''}
${inner}
</div>
</div>
</foreignObject>
</svg>`;
}
