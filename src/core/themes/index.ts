import { getThemeMeta, type ThemeId, type ThemeMeta } from '../catalog/themes.js';
import type { ThemeRenderer } from '../types.js';
import { ascii } from './ascii.js';
import { aurora } from './aurora.js';
import { blueprint } from './blueprint.js';
import { brutalist } from './brutalist.js';
import { cartoon } from './cartoon.js';
import { classic } from './classic.js';
import { cyberpunk } from './cyberpunk.js';
import { dracula } from './dracula.js';
import { editorial } from './editorial.js';
import { hacker } from './hacker.js';
import { lofi } from './lofi.js';
import { minimal } from './minimal.js';
import { modern } from './modern.js';
import { neon } from './neon.js';
import { nord } from './nord.js';
import { notebook } from './notebook.js';
import { pixel } from './pixel.js';
import { retro } from './retro.js';
import { synthwave } from './synthwave.js';
import { ticket } from './ticket.js';

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
  cyberpunk,
  cartoon,
  retro,
  neon,
  blueprint,
  notebook,
  ticket,
};

export type Theme = ThemeMeta & ThemeRenderer;

export function getTheme(id: string): Theme {
  const meta = getThemeMeta(id);
  return { ...meta, ...RENDERERS[meta.id as ThemeId] };
}
