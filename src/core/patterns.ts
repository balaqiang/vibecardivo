import heroPatterns from 'hero-patterns';
import { type CustomPatternId, findPattern, isCustomPattern } from './catalog/patterns.js';

type HeroFn = (fill: string, opacity: number) => string;
const hero = heroPatterns as unknown as Record<string, HeroFn>;

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const CUSTOM: Record<CustomPatternId, (c: string, o: number) => string> = {
  grid: (c, o) =>
    svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M24 0H0v24" fill="none" stroke="${c}" stroke-opacity="${o}"/></svg>`,
    ),
  dots: (c, o) =>
    svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="2" cy="2" r="1.5" fill="${c}" fill-opacity="${o}"/></svg>`,
    ),
  scanlines: (c, o) =>
    svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="2" fill="${c}" fill-opacity="${o}"/></svg>`,
    ),
  diagonal: (c, o) =>
    svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M-1 1l2-2M0 10L10 0M9 11l2-2" stroke="${c}" stroke-opacity="${o}" stroke-width="1.5"/></svg>`,
    ),
  crosshatch: (c, o) =>
    svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M0 0l12 12M12 0L0 12" stroke="${c}" stroke-opacity="${o}"/></svg>`,
    ),
  grain: (c, o) => {
    const [r, g, b] = [1, 3, 5].map((i) =>
      (Number.parseInt(c.slice(i, i + 2), 16) / 255).toFixed(3),
    );
    return svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 ${o * 2} -${o * 0.6}"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
    );
  },
};

/**
 * CSS `background-image` value for a pattern, or `null` if the id is unknown.
 * `color` must be a `#rrggbb` hex string.
 */
export function patternImage(id: string, color: string, opacity: number): string | null {
  const pattern = findPattern(id);
  if (!pattern) return null;
  if (isCustomPattern(pattern)) return CUSTOM[pattern](color, opacity);
  const fn = hero[pattern];
  return fn ? fn(color, opacity) : null;
}
