/**
 * Renders every theme with sample data into a folder plus an index.html for eyeballing:
 *   pnpm gallery ./gallery ["extra=query&params"] [--offline]
 * `--offline` skips avatar downloads (initials placeholder), used for docs/themes.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { THEMES } from '../src/core/catalog/themes.js';
import { parseCardParams } from '../src/core/params.js';
import { renderCard } from '../src/core/render.js';

const args = process.argv.slice(2);
const offline = args.includes('--offline');
const [out = 'gallery', extra = ''] = args.filter((a) => !a.startsWith('--'));
if (offline) globalThis.fetch = async () => new Response(null, { status: 404 });
mkdirSync(out, { recursive: true });

const sample = new URLSearchParams({
  name: 'Balaqiang',
  role: 'Creative Developer',
  description:
    'Building delightful things for the web — open source, design systems and tiny tools that spark joy ✨',
  location: 'Bali, Indonesia',
  site: 'https://balaqiang.dev',
  github: 'octocat',
  x: 'balaqiang',
  instagram: 'balaqiang',
  linkedin: 'Balaqiang',
  skills: 'TypeScript,Svelte,Rust,Figma',
});
for (const [k, v] of new URLSearchParams(extra)) sample.set(k, v);

const items: string[] = [];
for (const theme of THEMES) {
  sample.set('theme', theme.id);
  const parsed = parseCardParams(sample);
  if (!parsed.ok) throw new Error(parsed.error);
  const file = `${theme.id}.svg`;
  writeFileSync(join(out, file), await renderCard(parsed.options));
  items.push(
    `<figure><img src="${file}" width="640" height="320" alt="${theme.name}"/><figcaption>${theme.name}</figcaption></figure>`,
  );
  console.log(`✓ ${file}`);
}
writeFileSync(
  join(out, 'index.html'),
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vibecard gallery</title><style>body{font:14px system-ui;background:#888;margin:0;padding:20px;display:grid;grid-template-columns:640px;gap:14px}figure{margin:0}figcaption{color:#fff;margin-top:4px}</style>${items.join('')}`,
);
