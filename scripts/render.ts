/**
 * Renders a card to stdout or a file without starting a server:
 *   pnpm tsx scripts/render.ts "name=Balaqiang&theme=ascii" > card.svg
 */
import { writeFileSync } from 'node:fs';
import { parseCardParams } from '../src/core/params.js';
import { renderCard, renderErrorCard } from '../src/core/render.js';

const [query = 'name=Balaqiang', out] = process.argv.slice(2);
const result = parseCardParams(new URLSearchParams(query));
const svg = result.ok ? await renderCard(result.options) : renderErrorCard(result.error);
if (out) writeFileSync(out, svg);
else process.stdout.write(svg);
