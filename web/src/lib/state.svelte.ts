import { PLATFORMS } from '@core/catalog/platforms';
import { type CardInput, fromQuery, toQuery } from '@core/query';

export interface BuilderState {
  name: string;
  role: string;
  description: string;
  image: string;
  location: string;
  site: string;
  theme: string;
  socials: Record<string, string>;
  /** Platform ids in the order they appear on the card. */
  order: string[];
  skills: string[];
  backgroundColor: string;
  fontColor: string;
  iconColor: string;
  pattern: string;
  colorPattern: string;
  opacity: number | null;
  avatarShape: string;
  radius: number | null;
  animation: string;
  hideAvatar: boolean;
}

const STORAGE_KEY = 'vibecard:builder';
const PLATFORM_IDS = PLATFORMS.map((p) => p.id);

export const defaults = (): BuilderState => ({
  name: 'Balaqiang',
  role: 'Creative Developer',
  description:
    'Building delightful things for the web — open source, design systems and tiny tools ✨',
  image: '',
  location: 'Bali, Indonesia',
  site: '',
  theme: 'classic',
  socials: { github: 'octocat', x: 'balaqiang', instagram: 'balaqiang' },
  order: ['github', 'x', 'instagram'],
  skills: ['TypeScript', 'Svelte', 'Rust'],
  backgroundColor: '',
  fontColor: '',
  iconColor: '',
  pattern: '',
  colorPattern: '',
  opacity: null,
  avatarShape: '',
  radius: null,
  animation: 'auto',
  hideAvatar: false,
});

function fromInput(input: CardInput): BuilderState {
  const base = defaults();
  const socials: Record<string, string> = {};
  const order: string[] = [];
  for (const [id, handle] of input.socials ?? []) {
    socials[id] = handle;
    order.push(id);
  }
  return {
    ...base,
    name: input.name ?? '',
    role: input.role ?? '',
    description: input.description ?? '',
    image: input.image ?? '',
    location: input.location ?? '',
    site: input.site ?? '',
    theme: input.theme ?? 'classic',
    socials,
    order,
    skills: [...(input.skills ?? [])],
    backgroundColor: input.backgroundColor ?? '',
    fontColor: input.fontColor ?? '',
    iconColor: input.iconColor ?? '',
    pattern: input.pattern ?? '',
    colorPattern: input.colorPattern ?? '',
    opacity: input.opacity ?? null,
    avatarShape: input.avatarShape ?? '',
    radius: input.radius ?? null,
    animation: input.animation ?? 'auto',
    hideAvatar: input.hideAvatar ?? false,
  };
}

/** URL query wins (shared builder links), then the saved draft, then the demo card. */
function load(): BuilderState {
  const params = new URLSearchParams(location.search);
  if (params.has('name')) return fromInput(fromQuery(params, PLATFORM_IDS));
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaults(), ...JSON.parse(saved) };
  } catch {}
  return defaults();
}

export const builder = $state<BuilderState>(load());

export function toInput(s: BuilderState): CardInput {
  return {
    name: s.name,
    role: s.role,
    description: s.description,
    image: s.hideAvatar ? '' : s.image,
    location: s.location,
    site: s.site,
    theme: s.theme,
    socials: s.order
      .filter((id) => s.socials[id]?.trim())
      .map((id) => [id, s.socials[id] ?? ''] as const),
    skills: s.skills,
    backgroundColor: s.backgroundColor,
    fontColor: s.fontColor,
    iconColor: s.iconColor,
    pattern: s.pattern,
    colorPattern: s.pattern && s.pattern !== 'none' ? s.colorPattern : '',
    opacity: s.opacity,
    avatarShape: s.avatarShape,
    radius: s.radius,
    animation: s.animation,
    hideAvatar: s.hideAvatar,
  };
}

export function setSocial(id: string, value: string) {
  builder.socials[id] = value;
  const has = builder.order.includes(id);
  if (value.trim() && !has) builder.order.push(id);
  if (!value.trim() && has) builder.order = builder.order.filter((x) => x !== id);
}

export function moveSocial(id: string, delta: -1 | 1) {
  const i = builder.order.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= builder.order.length) return;
  const next = [...builder.order];
  [next[i], next[j]] = [next[j] as string, next[i] as string];
  builder.order = next;
}

export function resetBuilder(blank = true) {
  const fresh = defaults();
  if (blank) {
    Object.assign(fresh, {
      name: '',
      role: '',
      description: '',
      location: '',
      socials: {},
      order: [],
      skills: [],
    });
  }
  Object.assign(builder, fresh);
}

/** Persists the draft and keeps the address bar as a shareable builder link. */
export function persist(s: BuilderState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
  const qs = toQuery(toInput(s)).toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}
