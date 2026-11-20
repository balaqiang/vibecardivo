import { BRAND_ICONS } from './icons.generated.js';

/** A 24×24 icon. Filled brand glyphs by default; `stroke` icons are outline glyphs. */
export interface IconDef {
  path: string;
  brand?: string;
  stroke?: boolean;
}

export interface Platform {
  /** Query parameter name, e.g. `?github=balaqiang`. */
  id: string;
  label: string;
  /** Short tag used by text-only themes (ascii, hacker). */
  short: string;
  icon: IconDef;
  placeholder: string;
  /** Shown in front of the input in the builder. */
  prefix?: string;
  /** Hostnames stripped when someone pastes a full profile URL. */
  hosts?: string[];
  /** Extra query parameter names that map to this platform. */
  aliases?: string[];
  /** Shown by default in the builder; the rest sit behind "more platforms". */
  popular?: boolean;
}

// Icons kept from the original Cardivo (iconmonstr, free licence): LinkedIn and the Twitter bird
// are no longer part of simple-icons.
const LINKEDIN =
  'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z';
const TWITTER =
  'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z';

/** Outline glyphs adapted from Lucide (ISC). */
export const UI_ICONS = {
  globe: {
    stroke: true,
    path: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20M2 12h20M12 2a15.3 15.3 0 0 1 4 10a15.3 15.3 0 0 1-4 10a15.3 15.3 0 0 1-4-10a15.3 15.3 0 0 1 4-10z',
  },
  mail: {
    stroke: true,
    path: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  },
  pin: {
    stroke: true,
    path: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
  },
} satisfies Record<string, IconDef>;

const b = BRAND_ICONS;

export const PLATFORMS: readonly Platform[] = [
  {
    id: 'github',
    label: 'GitHub',
    short: 'gh',
    icon: b.github,
    placeholder: 'username',
    prefix: 'github.com/',
    hosts: ['github.com'],
    popular: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    short: 'in',
    icon: { path: LINKEDIN, brand: '#0a66c2' },
    placeholder: 'name or handle',
    prefix: 'linkedin.com/in/',
    hosts: ['linkedin.com/in', 'linkedin.com'],
    popular: true,
  },
  {
    id: 'x',
    label: 'X',
    short: 'x',
    icon: b.x,
    placeholder: 'handle',
    prefix: 'x.com/',
    hosts: ['x.com', 'twitter.com'],
    popular: true,
  },
  {
    id: 'twitter',
    label: 'Twitter',
    short: 'tw',
    icon: { path: TWITTER, brand: '#1d9bf0' },
    placeholder: 'handle',
    prefix: 'twitter.com/',
    hosts: ['twitter.com', 'x.com'],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    short: 'ig',
    icon: b.instagram,
    placeholder: 'username',
    prefix: 'instagram.com/',
    hosts: ['instagram.com'],
    popular: true,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    short: 'yt',
    icon: b.youtube,
    placeholder: '@channel',
    prefix: 'youtube.com/',
    hosts: ['youtube.com'],
    popular: true,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    short: 'tt',
    icon: b.tiktok,
    placeholder: '@username',
    prefix: 'tiktok.com/',
    hosts: ['tiktok.com'],
    popular: true,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    short: 'fb',
    icon: b.facebook,
    placeholder: 'username',
    prefix: 'facebook.com/',
    hosts: ['facebook.com', 'fb.com'],
  },
  {
    id: 'threads',
    label: 'Threads',
    short: 'th',
    icon: b.threads,
    placeholder: '@username',
    prefix: 'threads.net/',
    hosts: ['threads.net', 'threads.com'],
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    short: 'bsky',
    icon: b.bluesky,
    placeholder: 'you.bsky.social',
    prefix: 'bsky.app/profile/',
    hosts: ['bsky.app/profile'],
  },
  {
    id: 'mastodon',
    label: 'Mastodon',
    short: 'mstdn',
    icon: b.mastodon,
    placeholder: '@you@mastodon.social',
  },
  {
    id: 'discord',
    label: 'Discord',
    short: 'dc',
    icon: b.discord,
    placeholder: 'username',
    popular: true,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    short: 'tg',
    icon: b.telegram,
    placeholder: 'username',
    prefix: 't.me/',
    hosts: ['t.me'],
  },
  { id: 'whatsapp', label: 'WhatsApp', short: 'wa', icon: b.whatsapp, placeholder: '+62 812 …' },
  {
    id: 'gitlab',
    label: 'GitLab',
    short: 'gl',
    icon: b.gitlab,
    placeholder: 'username',
    prefix: 'gitlab.com/',
    hosts: ['gitlab.com'],
  },
  {
    id: 'dribbble',
    label: 'Dribbble',
    short: 'drbl',
    icon: b.dribbble,
    placeholder: 'username',
    prefix: 'dribbble.com/',
    hosts: ['dribbble.com'],
  },
  {
    id: 'behance',
    label: 'Behance',
    short: 'be',
    icon: b.behance,
    placeholder: 'username',
    prefix: 'behance.net/',
    hosts: ['behance.net'],
  },
  {
    id: 'figma',
    label: 'Figma',
    short: 'fig',
    icon: b.figma,
    placeholder: '@username',
    prefix: 'figma.com/',
    hosts: ['figma.com'],
  },
  {
    id: 'medium',
    label: 'Medium',
    short: 'md',
    icon: b.medium,
    placeholder: '@username',
    prefix: 'medium.com/',
    hosts: ['medium.com'],
  },
  {
    id: 'devto',
    label: 'DEV',
    short: 'dev',
    icon: b.devto,
    placeholder: 'username',
    prefix: 'dev.to/',
    hosts: ['dev.to'],
    aliases: ['dev'],
  },
  {
    id: 'hashnode',
    label: 'Hashnode',
    short: 'hn',
    icon: b.hashnode,
    placeholder: '@username',
    prefix: 'hashnode.com/',
    hosts: ['hashnode.com'],
  },
  {
    id: 'substack',
    label: 'Substack',
    short: 'sub',
    icon: b.substack,
    placeholder: 'you.substack.com',
  },
  {
    id: 'stackoverflow',
    label: 'Stack Overflow',
    short: 'so',
    icon: b.stackoverflow,
    placeholder: 'user id or name',
  },
  {
    id: 'leetcode',
    label: 'LeetCode',
    short: 'lc',
    icon: b.leetcode,
    placeholder: 'username',
    prefix: 'leetcode.com/u/',
    hosts: ['leetcode.com/u', 'leetcode.com'],
  },
  {
    id: 'kaggle',
    label: 'Kaggle',
    short: 'kg',
    icon: b.kaggle,
    placeholder: 'username',
    prefix: 'kaggle.com/',
    hosts: ['kaggle.com'],
  },
  {
    id: 'huggingface',
    label: 'Hugging Face',
    short: 'hf',
    icon: b.huggingface,
    placeholder: 'username',
    prefix: 'huggingface.co/',
    hosts: ['huggingface.co'],
  },
  {
    id: 'npm',
    label: 'npm',
    short: 'npm',
    icon: b.npm,
    placeholder: '~username',
    prefix: 'npmjs.com/',
    hosts: ['npmjs.com'],
  },
  {
    id: 'reddit',
    label: 'Reddit',
    short: 'r/',
    icon: b.reddit,
    placeholder: 'u/username',
    prefix: 'reddit.com/',
    hosts: ['reddit.com'],
  },
  {
    id: 'twitch',
    label: 'Twitch',
    short: 'ttv',
    icon: b.twitch,
    placeholder: 'channel',
    prefix: 'twitch.tv/',
    hosts: ['twitch.tv'],
  },
  { id: 'spotify', label: 'Spotify', short: 'sp', icon: b.spotify, placeholder: 'artist or user' },
  { id: 'steam', label: 'Steam', short: 'stm', icon: b.steam, placeholder: 'profile name' },
  {
    id: 'kofi',
    label: 'Ko-fi',
    short: 'kofi',
    icon: b.kofi,
    placeholder: 'username',
    prefix: 'ko-fi.com/',
    hosts: ['ko-fi.com'],
  },
  {
    id: 'buymeacoffee',
    label: 'Buy Me a Coffee',
    short: 'bmc',
    icon: b.buymeacoffee,
    placeholder: 'username',
    prefix: 'buymeacoffee.com/',
    hosts: ['buymeacoffee.com'],
  },
  {
    id: 'patreon',
    label: 'Patreon',
    short: 'ptrn',
    icon: b.patreon,
    placeholder: 'username',
    prefix: 'patreon.com/',
    hosts: ['patreon.com'],
  },
  {
    id: 'linktree',
    label: 'Linktree',
    short: 'lt',
    icon: b.linktree,
    placeholder: 'username',
    prefix: 'linktr.ee/',
    hosts: ['linktr.ee'],
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    short: 'pin',
    icon: b.pinterest,
    placeholder: 'username',
    prefix: 'pinterest.com/',
    hosts: ['pinterest.com'],
  },
  {
    id: 'producthunt',
    label: 'Product Hunt',
    short: 'ph',
    icon: b.producthunt,
    placeholder: '@username',
    prefix: 'producthunt.com/',
    hosts: ['producthunt.com'],
  },
  {
    id: 'email',
    label: 'Email',
    short: 'mail',
    icon: UI_ICONS.mail,
    placeholder: 'you@example.com',
    aliases: ['mail'],
    popular: true,
  },
];

const byParam = new Map<string, Platform>();
for (const p of PLATFORMS) {
  byParam.set(p.id, p);
  for (const alias of p.aliases ?? []) byParam.set(alias, p);
}

/** Resolves a query parameter name (case-insensitive, aliases included) to its platform. */
export const platformForParam = (param: string): Platform | undefined =>
  byParam.get(param.toLowerCase());

export const getPlatform = (id: string): Platform | undefined => byParam.get(id);
