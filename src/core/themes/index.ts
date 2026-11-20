import { getThemeMeta, type ThemeId, type ThemeMeta } from '../catalog/themes.js';
import type { ThemeRenderer } from '../types.js';
import { ascii } from './ascii.js';
import { aurora } from './aurora.js';
import { brutalist } from './brutalist.js';
import { classic } from './classic.js';
import { dracula } from './dracula.js';
import { editorial } from './editorial.js';
import { hacker } from './hacker.js';
import { lofi } from './lofi.js';
import { minimal } from './minimal.js';
import { modern } from './modern.js';
import { nord } from './nord.js';
import { pixel } from './pixel.js';
import { synthwave } from './synthwave.js';

const RENDERERS: Record<ThemeId, ThemeRenderer> = {
  classic,
  modern,
  aurora,
  minimal,
  hacker,
  ascii,
  lofi,
  synthwave,
  pixel,
  brutalist,
  editorial,
  dracula,
  nord,
};

export type Theme = ThemeMeta & ThemeRenderer;

export function getTheme(id: string): Theme {
  const meta = getThemeMeta(id);
  return { ...meta, ...RENDERERS[meta.id as ThemeId] };
}
