import figlet from 'figlet';
import Mini from 'figlet/importable-fonts/Mini.js';
import Small from 'figlet/importable-fonts/Small.js';
import Standard from 'figlet/importable-fonts/Standard.js';

const FONTS = { Standard, Small, Mini } as const;
type FigletFont = keyof typeof FONTS;
for (const [name, data] of Object.entries(FONTS)) figlet.parseFont(name, data);

/** Removes blank rows and the indentation shared by every row. */
function tidy(lines: string[]): string[] {
  const rows = lines.map((l) => l.replace(/\s+$/, ''));
  while (rows.length && !rows[0]?.trim()) rows.shift();
  while (rows.length && !rows[rows.length - 1]?.trim()) rows.pop();
  const indent = Math.min(
    ...rows.filter((r) => r.trim()).map((r) => r.match(/^ */)?.[0].length ?? 0),
  );
  return rows.map((r) => r.slice(Number.isFinite(indent) ? indent : 0));
}

/**
 * Renders `text` as a FIGlet banner using the largest font that fits in `maxWidth` columns.
 * Returns `null` when even the smallest font is too wide (callers fall back to plain text).
 */
export function banner(text: string, maxWidth: number, maxRows = 6): string[] | null {
  if (!text.trim()) return null;
  for (const font of Object.keys(FONTS) as FigletFont[]) {
    const rows = tidy(figlet.textSync(text, { font }).split('\n'));
    if (rows.length <= maxRows && Math.max(...rows.map((r) => r.length)) <= maxWidth) return rows;
  }
  return null;
}
