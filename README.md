<div align="center">

<img src="docs/themes/classic.svg" width="640" alt="Vibecard classic theme preview" />

<h1>Vibecard</h1>

<p><b>Dynamic SVG profile cards for your GitHub README</b> — 13 themes, 38 social platforms and a visual card builder.</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Hono](https://img.shields.io/badge/API-Hono-ff5b11?logo=hono&logoColor=white)
![Svelte](https://img.shields.io/badge/Builder-Svelte%205-ff3e00?logo=svelte&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel%20%7C%20Docker-000?logo=vercel&logoColor=white)

<sub>Built by <b>Balaqiang</b> · inspired by <a href="https://github.com/satyawikananda/cardivo">Cardivo</a> by Satya Wikananda</sub>

</div>

---

## Contents

- [What is Vibecard?](#what-is-vibecard)
- [What's new compared to Cardivo](#whats-new-compared-to-cardivo)
- [Themes](#themes)
- [Quick start](#quick-start)
- [API reference](#api-reference)
- [Light & dark mode](#light--dark-mode)
- [Development](#development)
- [Deployment](#deployment)
- [Knowledge graph (Graphify)](#knowledge-graph-graphify)
- [Inspiration & credits](#inspiration--credits)
- [License](#license)

## What is Vibecard?

GitHub shows a `README.md` from a repository named after your username right on your profile.
Vibecard turns a single URL into an SVG "business card" you can drop into that README:

```md
![My card](https://YOUR-DEPLOYMENT.vercel.app/api?name=Balaqiang&role=Creative%20Developer&github=balaqiang&theme=modern)
```

Every card is rendered on request by a serverless function. Fonts and avatars are inlined into
the SVG so it works behind GitHub's image proxy (Camo), and responses are cached at the edge.

Prefer clicking to typing query strings? Open your deployment's home page: the **card builder**
lets you fill in your profile, social links, skills and theme with a live preview, then copies
the Markdown/HTML for you.

## What's new compared to Cardivo

Everything the original Cardivo could do still works, with the **same URL parameters** — old
README links keep rendering. On top of that:

|     | Feature                                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 🎨  | **13 themes** — classic, modern, aurora, minimal, hacker, ascii, lofi, synthwave, pixel, brutalist, editorial, dracula, nord             |
| 🧰  | **Visual card builder** (Svelte 5) with live preview, theme gallery, GitHub profile import, shareable links and a GitHub-style light/dark UI |
| 🔗  | **38 social platforms** (was 4), shown in the order you choose; full profile URLs are cleaned up automatically                           |
| 🏷️  | New fields: `role`, `location`, `skills` tags, `avatarShape`, `radius`, `animation`, `hideAvatar`                                        |
| 🖼️  | **GitHub avatar fallback** — no `image`? Your GitHub avatar (or an initials badge) is used                                               |
| 🔤  | ASCII theme renders your **name as a FIGlet banner and your photo as ASCII art**                                                         |
| 🌗  | Copy-ready `<picture>` snippet that swaps themes for dark-mode visitors                                                                  |
| ♿  | Automatic text contrast when you change only the background; `prefers-reduced-motion` respected                                          |
| ⚡  | CDN cache headers, ETags/304s, in-memory avatar LRU cache, per-theme font loading                                                        |
| 🛡️  | All input validated (zod) and escaped, strict CSP on SVGs, SSRF guard + size/time limits on avatar fetches                               |
| 🧯  | Friendly **error card** instead of a broken image when something is wrong                                                                |
| 🐳  | Runs on Vercel **or** anywhere Node/Docker runs                                                                                          |
| ✅  | Strict TypeScript, Biome, 60+ Vitest tests (every theme is checked for well-formed, self-contained SVG)                                  |

## Themes

Pick one with `?theme=<id>`. The default is `classic`, the original Cardivo look.

|                              `classic`                              |                              `modern`                               |
| :-----------------------------------------------------------------: | :-----------------------------------------------------------------: |
|   <img src="docs/themes/classic.svg" width="400" alt="classic" />   |    <img src="docs/themes/modern.svg" width="400" alt="modern" />    |
|                            **`aurora`**                             |                            **`minimal`**                            |
|    <img src="docs/themes/aurora.svg" width="400" alt="aurora" />    |   <img src="docs/themes/minimal.svg" width="400" alt="minimal" />   |
|                            **`hacker`**                             |                             **`ascii`**                             |
|    <img src="docs/themes/hacker.svg" width="400" alt="hacker" />    |     <img src="docs/themes/ascii.svg" width="400" alt="ascii" />     |
|                             **`lofi`**                              |                           **`synthwave`**                           |
|      <img src="docs/themes/lofi.svg" width="400" alt="lofi" />      | <img src="docs/themes/synthwave.svg" width="400" alt="synthwave" /> |
|                             **`pixel`**                             |                           **`brutalist`**                           |
|     <img src="docs/themes/pixel.svg" width="400" alt="pixel" />     | <img src="docs/themes/brutalist.svg" width="400" alt="brutalist" /> |
|                           **`editorial`**                           |                            **`dracula`**                            |
| <img src="docs/themes/editorial.svg" width="400" alt="editorial" /> |   <img src="docs/themes/dracula.svg" width="400" alt="dracula" />   |
|                             **`nord`**                              |                                                                     |
|      <img src="docs/themes/nord.svg" width="400" alt="nord" />      |                                                                     |

| Theme       | Vibe                                                                 | Signature animation |
| ----------- | -------------------------------------------------------------------- | ------------------- |
| `classic`   | The original: Montserrat, avatar right, divider line                 | slide               |
| `modern`    | Clean light card, gradient ring avatar, pill chips                   | fade                |
| `aurora`    | Dark glass panel over drifting aurora blobs                          | fade                |
| `minimal`   | Monochrome, whitespace, text-only links                              | fade                |
| `hacker`    | Matrix-green terminal typing `whoami`, `cat about.txt`, `ls ./links` | type                |
| `ascii`     | Pure text grid: FIGlet name, ASCII-art photo, `+---+` frame          | type                |
| `lofi`      | Grainy dusk gradient, spinning vinyl avatar, equalizer, progress bar | fade                |
| `synthwave` | Neon sun, scrolling perspective grid, chrome text                    | pop                 |
| `pixel`     | 8-bit handheld palette, pixel fonts, RPG stats + dialog box          | pop                 |
| `brutalist` | Loud yellow, thick borders, hard shadows, sticker                    | pop                 |
| `editorial` | Newspaper masthead, serif headline, drop cap, captioned photo        | fade                |
| `dracula`   | Your profile as a syntax-highlighted TypeScript object               | type                |
| `nord`      | Calm arctic palette, frosty accent bar                               | fade                |

> Previews above are rendered offline with an initials avatar. Regenerate them with
> `pnpm gallery docs/themes "github=you" --offline`.

## Quick start

1. Deploy your own instance ([Vercel](#vercel) takes about a minute) or run it locally.
2. Open the deployment's home page and build your card, or write the URL by hand.
3. Paste the Markdown into your profile README:

```md
![Balaqiang's card](https://YOUR-DEPLOYMENT.vercel.app/api?name=Balaqiang&role=Creative%20Developer&description=Building%20delightful%20things%20for%20the%20web&location=Bali&github=balaqiang&x=balaqiang&skills=TypeScript,Svelte,Rust&theme=lofi)
```

Or as HTML, to control the width:

```html
<img src="https://YOUR-DEPLOYMENT.vercel.app/api?name=Balaqiang&amp;theme=hacker&amp;github=balaqiang" width="600" alt="Balaqiang's card" />
```

> Remember to URL-encode values: spaces → `%20`, `#` → `%23`, `&` → `%26`. The builder does this for you.

## API reference

```
GET /api            → image/svg+xml   (also /api/card and /api/card.svg)
GET /api/themes     → JSON list of themes with their default palettes
GET /api/platforms  → JSON list of supported social platforms
GET /api/patterns   → JSON list of background patterns
GET /api/health     → { ok, version }
```

### Card parameters

Parameters marked **v1** come from the original Cardivo and behave the same way.

| Parameter                 | Description                                                              | Example                      |
| ------------------------- | ------------------------------------------------------------------------ | ---------------------------- |
| `name` **v1**             | **Required.** Your name (max 60 chars)                                   | `Satya%20Wikananda`          |
| `description` **v1**      | Short bio (max 240 chars)                                                | `I%20build%20things`         |
| `image` **v1**            | Avatar URL (http/https). `none` hides it. Defaults to your GitHub avatar | `https://example.com/me.jpg` |
| `backgroundColor` **v1**  | Card background (hex, `#` optional) or `transparent`                     | `%23ecf0f1`                  |
| `fontColor` **v1**        | Text colour                                                              | `%23000000`                  |
| `iconColor` **v1**        | Icon / accent colour                                                     | `%23e64a19`                  |
| `site` **v1**             | Your website                                                             | `https://balaqiang.dev`      |
| `pattern` **v1**          | Background pattern ([list](#patterns)); `none` removes a theme's default | `leaf`                       |
| `colorPattern` **v1**     | Pattern colour                                                           | `%23eaeaea`                  |
| `opacity` **v1**          | Pattern opacity, `0`–`1`                                                 | `0.4`                        |
| `disableAnimation` **v1** | `true` turns all motion off                                              | `true`                       |
| `theme`                   | One of the [13 themes](#themes)                                          | `ascii`                      |
| `role`                    | Job title or tagline                                                     | `Frontend%20Engineer`        |
| `location`                | Where you are                                                            | `Bali,%20Indonesia`          |
| `skills`                  | Comma-separated tags (max 8)                                             | `TypeScript,Svelte,Rust`     |
| `avatarShape`             | `circle`, `rounded`, `square` or `hexagon`                               | `hexagon`                    |
| `radius`                  | Card corner radius in px, `0`–`48`                                       | `24`                         |
| `animation`               | `auto` (theme default), `slide`, `fade`, `pop`, `type` or `none`         | `type`                       |
| `hideAvatar`              | `true` to render without an avatar                                       | `true`                       |

Unknown or invalid optional values fall back to the theme's defaults instead of failing, so a typo
never breaks your README. A missing `name` renders an error card explaining what to fix.

### Social links

Add any of these as `?platform=handle`. Links appear **in the order you write them**; each theme
shows as many as fit (4–6). Pasting a full profile URL works too — `https://github.com/you` becomes `you`.

| Param            | Platform       | Param             | Platform       | Param              | Platform        |
| ---------------- | -------------- | ----------------- | -------------- | ------------------ | --------------- |
| `github` **v1**  | GitHub         | `linkedin` **v1** | LinkedIn       | `instagram` **v1** | Instagram       |
| `twitter` **v1** | Twitter (bird) | `x`               | X              | `youtube`          | YouTube         |
| `tiktok`         | TikTok         | `facebook`        | Facebook       | `threads`          | Threads         |
| `bluesky`        | Bluesky        | `mastodon`        | Mastodon       | `discord`          | Discord         |
| `telegram`       | Telegram       | `whatsapp`        | WhatsApp       | `gitlab`           | GitLab          |
| `dribbble`       | Dribbble       | `behance`         | Behance        | `figma`            | Figma           |
| `medium`         | Medium         | `devto` / `dev`   | DEV            | `hashnode`         | Hashnode        |
| `substack`       | Substack       | `stackoverflow`   | Stack Overflow | `leetcode`         | LeetCode        |
| `kaggle`         | Kaggle         | `huggingface`     | Hugging Face   | `npm`              | npm             |
| `reddit`         | Reddit         | `twitch`          | Twitch         | `spotify`          | Spotify         |
| `steam`          | Steam          | `kofi`            | Ko-fi          | `buymeacoffee`     | Buy Me a Coffee |
| `patreon`        | Patreon        | `linktree`        | Linktree       | `pinterest`        | Pinterest       |
| `producthunt`    | Product Hunt   | `email` / `mail`  | Email          |                    |                 |

### Patterns

All **87 [Hero Patterns](https://heropatterns.com)** are available (names are case-insensitive, so
`polkaDots` and `polkadots` both work). The 15 documented by the original Cardivo:

`plus` · `topography` · `texture` · `hideout` · `fallingTriangles` · `iLikeFood` · `fourPointStars` ·
`brickWall` · `wiggle` · `bubbles` · `floatingCogs` · `leaf` · `rain` · `polkaDots` · `ticTacToe`

Plus six drawn by Vibecard itself: `grid` · `dots` · `scanlines` · `grain` · `diagonal` · `crosshatch`.
`GET /api/patterns` lists everything.

## Light & dark mode

GitHub can swap images based on the visitor's colour scheme. The builder's **Light + dark** tab
generates this for you:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://YOUR-DEPLOYMENT.vercel.app/api?name=Balaqiang&amp;theme=aurora" />
  <img src="https://YOUR-DEPLOYMENT.vercel.app/api?name=Balaqiang&amp;theme=modern" alt="Balaqiang's card" width="600" />
</picture>
```

## Development

Requires Node 22.12+ and [pnpm](https://pnpm.io).

```bash
pnpm install
```

```bash
pnpm dev          # builder + API on http://localhost:5173 (Hono runs inside Vite)
```

```bash
pnpm check        # Biome lint + TypeScript/Svelte typecheck + Vitest
```

Handy scripts:

| Script                                        | What it does                                                         |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `pnpm render "name=You&theme=ascii" card.svg` | Render one card to a file, no server needed                          |
| `pnpm gallery ./out`                          | Render every theme into `./out` with an `index.html` to eyeball      |
| `pnpm build` / `pnpm build:server`            | Build the builder (`dist/`) / the self-host server (`dist-server/`)  |
| `pnpm fonts:sync`                             | Copy the fonts listed in `src/core/catalog/fonts.ts` from Fontsource |
| `pnpm icons:sync`                             | Regenerate brand icons from Simple Icons                             |
| `pnpm graph`                                  | Refresh the Graphify knowledge graph                                 |

### Project structure

```
vibecard/
├── api/index.ts              # Vercel Function → Hono app
├── assets/fonts/             # Embedded WOFF2 fonts (OFL)
├── src/
│   ├── core/                 # Framework-free renderer
│   │   ├── catalog/          # Pure data shared with the builder: themes, platforms, patterns, fonts
│   │   ├── themes/           # One file per theme: CSS + optional custom layout
│   │   ├── ascii/            # FIGlet banners and image → ASCII art
│   │   ├── params.ts         # Query-string validation (zod), v1-compatible
│   │   ├── render.ts         # Palette, avatar, pattern → SVG pipeline
│   │   ├── layout.ts         # Shared markup, base CSS, animation presets
│   │   ├── image.ts          # Avatar fetching with LRU cache + SSRF guard
│   │   └── query.ts          # URL builder used by the builder and tests
│   └── server/               # Hono app (routes, headers) + Node entry for self-hosting
├── web/                      # Svelte 5 card builder (Vite)
├── tests/                    # Vitest suites
├── scripts/                  # render / gallery / font + icon sync
└── docs/themes/              # README previews
```

**Adding a theme:** add its metadata (palette, fonts, defaults) to `src/core/catalog/themes.ts`,
create `src/core/themes/<id>.ts` exporting `css()` and optionally `body()`, register it in
`src/core/themes/index.ts`. The test suite automatically checks it renders valid, self-contained SVG.

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/balaqiang/vibecard)

`vercel.json` already configures everything: the builder is served from `dist/`, every `/api/*`
route goes to `api/index.ts`, and the fonts are bundled with the function.

### Docker / any Node host

```bash
docker build -t vibecard .
```

```bash
docker run -p 3000:3000 vibecard
```

Without Docker: `pnpm build && pnpm build:server && pnpm start` (set `PORT` to change the port).

## Knowledge graph (Graphify)

This repo ships with the [Graphify](https://github.com/Graphify-Labs/graphify) skill installed for
Claude Code (`.claude/skills/graphify`). It maps the codebase into a queryable knowledge graph so AI
assistants can answer "how does X work?" without grepping every file.

```bash
uv tool install graphifyy   # one-time: install the CLI
```

```bash
pnpm graph                  # rebuild graphify-out/ from the code (AST only, no LLM, nothing leaves your machine)
```

Then ask your assistant, or query it directly: `graphify query "how is a card rendered?"`,
`graphify explain "renderCard"`. In Claude Code, type `/graphify .`.

## Inspiration & credits

Vibecard is a from-scratch rebuild of Cardivo with a new name, and it stands on a lot of great work:

- **[Cardivo](https://github.com/satyawikananda/cardivo)** by **[Satya Wikananda](https://github.com/satyawikananda)** —
  the original project and the direct inspiration for this one: the idea, the URL API, the classic
  card design and the use of Hero Patterns all come from it. Thank you! 🙏
- **[GitHub profile READMEs](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)** — the feature that made cards like this worth building.
- **[github-readme-stats](https://github.com/anuraghazra/github-readme-stats)** by Anurag Hazra — proof that serverless SVG cards are a great fit for READMEs.
- **[Hero Patterns](https://heropatterns.com)** by Steve Schoger, packaged as [`hero-patterns`](https://github.com/lowmess/hero-patterns) by Alec Lomas.
- **[Simple Icons](https://simpleicons.org)** (CC0) for brand icons, **[iconmonstr](https://iconmonstr.com)** for the LinkedIn and Twitter icons kept from the original, **[Lucide](https://lucide.dev)** for UI glyphs.
- **[Fontsource](https://fontsource.org)** and the designers of Montserrat, Inter, JetBrains Mono, Quicksand, Orbitron, Press Start 2P, VT323, Space Grotesk, Playfair Display and Lora.
- **[Primer](https://primer.style)**, GitHub's design system, which the builder's look is modelled on, and **[Mona Sans](https://github.com/github/mona-sans)** by GitHub for its headings.
- **[figlet.js](https://github.com/patorjk/figlet.js)** and the FIGlet fonts behind the ASCII theme.
- Theme palettes inspired by **[Dracula](https://draculatheme.com)**, **[Nord](https://www.nordtheme.com)**, 80s synthwave, lo-fi hip-hop streams, neo-brutalism and classic handheld consoles.
- Built with **[Hono](https://hono.dev)**, **[Svelte](https://svelte.dev)**, **[Vite](https://vite.dev)**, **[zod](https://zod.dev)**, **[Vitest](https://vitest.dev)** and **[Biome](https://biomejs.dev)**; codebase mapped with **[Graphify](https://github.com/Graphify-Labs/graphify)**.

## License

[MIT](LICENSE) © 2026 Balaqiang. The original Cardivo is © 2020–2021 I Gusti Ngurah Satya Wikananda, also MIT.
