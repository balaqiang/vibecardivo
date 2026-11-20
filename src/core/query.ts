/**
 * Builds card URLs. Shared by the web builder and the tests, and intentionally free of
 * dependencies so it stays tiny in the browser bundle.
 */
export interface CardInput {
  name?: string;
  role?: string;
  description?: string;
  image?: string;
  location?: string;
  site?: string;
  theme?: string;
  /** `[platformId, handle]` pairs, in display order. */
  socials?: ReadonlyArray<readonly [string, string]>;
  skills?: readonly string[];
  backgroundColor?: string;
  fontColor?: string;
  iconColor?: string;
  pattern?: string;
  colorPattern?: string;
  opacity?: number | null;
  avatarShape?: string;
  radius?: number | null;
  animation?: string;
  hideAvatar?: boolean;
}

const TEXT_KEYS = ['name', 'role', 'description', 'image', 'location', 'site', 'theme'] as const;
const STYLE_KEYS = [
  'backgroundColor',
  'fontColor',
  'iconColor',
  'pattern',
  'colorPattern',
  'avatarShape',
  'animation',
] as const;

/** Query string for a card. Empty values are skipped so URLs stay short. */
export function toQuery(input: CardInput): URLSearchParams {
  const q = new URLSearchParams();
  const put = (key: string, value: string | undefined) => {
    const v = value?.trim();
    if (v) q.set(key, v);
  };

  for (const key of TEXT_KEYS) put(key, input[key]);
  if (input.theme === 'classic') q.delete('theme');
  for (const [platform, handle] of input.socials ?? []) put(platform, handle);
  if (input.skills?.length) put('skills', input.skills.join(','));
  for (const key of STYLE_KEYS) put(key, input[key]);
  if (input.animation === 'auto') q.delete('animation');
  if (input.opacity != null && input.pattern && input.pattern !== 'none') {
    q.set('opacity', String(input.opacity));
  }
  if (input.radius != null) q.set('radius', String(input.radius));
  if (input.hideAvatar) q.set('hideAvatar', 'true');
  return q;
}

export const cardUrl = (base: string, input: CardInput): string => {
  const qs = toQuery(input).toString();
  return `${base.replace(/\/+$/, '')}/api${qs ? `?${qs}` : ''}`;
};

/** Reads builder state back out of a card URL's query string. */
export function fromQuery(params: URLSearchParams, platformIds: readonly string[]): CardInput {
  const get = (k: string) => params.get(k) ?? undefined;
  const num = (k: string) => {
    const v = params.get(k);
    return v === null || v === '' || Number.isNaN(Number(v)) ? null : Number(v);
  };
  const known = new Set(platformIds);
  const socials: Array<[string, string]> = [];
  for (const [key, value] of params) if (known.has(key) && value) socials.push([key, value]);

  return {
    name: get('name'),
    role: get('role'),
    description: get('description'),
    image: get('image'),
    location: get('location'),
    site: get('site'),
    theme: get('theme'),
    socials,
    skills: (params.get('skills') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    backgroundColor: get('backgroundColor'),
    fontColor: get('fontColor'),
    iconColor: get('iconColor'),
    pattern: get('pattern'),
    colorPattern: get('colorPattern'),
    opacity: num('opacity'),
    avatarShape: get('avatarShape'),
    radius: num('radius'),
    animation: params.get('disableAnimation') === 'true' ? 'none' : get('animation'),
    hideAvatar: params.get('hideAvatar') === 'true',
  };
}
