import type { Platform } from './catalog/platforms.js';
import type {
  Animation,
  AnimationOption,
  AvatarShape,
  Palette,
  ThemeId,
  ThemeMeta,
} from './catalog/themes.js';

export interface SocialLink {
  platform: Platform;
  handle: string;
}

/** Validated, normalised card options parsed from the query string. */
export interface CardOptions {
  name: string;
  description: string;
  role: string;
  location: string;
  site: string;
  /** Explicit http(s) avatar URL. */
  image: string | null;
  hideAvatar: boolean;
  theme: ThemeId;
  colors: {
    /** `#rrggbb[aa]` or `transparent`. */
    background?: string;
    text?: string;
    accent?: string;
  };
  /** `undefined` = theme default, `null` = no pattern. */
  pattern: string | null | undefined;
  patternColor?: string;
  patternOpacity?: number;
  skills: string[];
  socials: SocialLink[];
  avatarShape?: AvatarShape;
  radius?: number;
  animation: AnimationOption;
}

export interface Avatar {
  /** Data URI, safe to inline in the SVG. */
  src: string;
  /** True when we fell back to the initials placeholder. */
  placeholder: boolean;
  /** Raw bytes, kept so text-mode themes can turn the photo into ASCII art. */
  bytes?: Uint8Array;
  mime?: string;
}

/** Already-escaped strings, safe to drop straight into markup. */
export interface SafeText {
  name: string;
  description: string;
  role: string;
  location: string;
  site: string;
  skills: string[];
}

/** Everything a theme needs to render. */
export interface RenderContext {
  opts: CardOptions;
  theme: ThemeMeta;
  palette: Palette;
  /** CSS background value: `palette.background` or `transparent`. */
  background: string;
  /** Whether the user overrode the background (themes then drop their gradients). */
  customBackground: boolean;
  text: SafeText;
  avatar: Avatar | null;
  socials: SocialLink[];
  shape: AvatarShape;
  radius: number;
  animation: Animation;
  pattern: { id: string; color: string; opacity: number } | null;
}

/** A theme implementation: its stylesheet plus an optional custom body. */
export interface ThemeRenderer {
  css(ctx: RenderContext): string;
  /** Inner markup of `.card`. Defaults to the shared split layout. */
  body?(ctx: RenderContext): string;
}
