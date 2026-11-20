<script lang="ts">
  import { BRAND_ICONS } from '@core/catalog/icons.generated';
  import { PLATFORMS } from '@core/catalog/platforms';
  import { THEMES } from '@core/catalog/themes';
  import { toQuery } from '@core/query';
  import { untrack } from 'svelte';
  import GithubImport from './lib/components/GithubImport.svelte';
  import Icon from './lib/components/Icon.svelte';
  import PreviewPanel from './lib/components/PreviewPanel.svelte';
  import ProfileFields from './lib/components/ProfileFields.svelte';
  import Section from './lib/components/Section.svelte';
  import SkillsInput from './lib/components/SkillsInput.svelte';
  import SocialFields from './lib/components/SocialFields.svelte';
  import StyleFields from './lib/components/StyleFields.svelte';
  import ThemePicker from './lib/components/ThemePicker.svelte';
  import { UI } from './lib/icons';
  import { builder, persist, toInput } from './lib/state.svelte';

  const REPO = 'https://github.com/balaqiang/vibecardivo';
  const ORIGINAL = 'https://github.com/satyawikananda/cardivo';
  const NAV = [
    ['Profile', '#profile'],
    ['Links', '#links'],
    ['Themes', '#theme'],
    ['Appearance', '#appearance'],
  ] as const;

  // Site colour scheme: follows the system until toggled, then remembered.
  const saved = (() => {
    try {
      return localStorage.getItem('vibecard:scheme');
    } catch {
      return null;
    }
  })();
  let scheme = $state<'light' | 'dark'>(
    saved === 'light' || saved === 'dark'
      ? saved
      : matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
  );
  $effect(() => {
    document.documentElement.dataset.theme = scheme;
  });
  function toggleScheme() {
    scheme = scheme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('vibecard:scheme', scheme);
    } catch {}
  }

  const query = $derived(toQuery(toInput(builder)).toString());

  // The preview re-renders shortly after typing stops; theme thumbnails wait a little longer.
  let previewQuery = $state(untrack(() => query));
  let thumbQuery = $state(untrack(() => query));
  $effect(() => {
    const q = query;
    const a = setTimeout(() => (previewQuery = q), 300);
    const b = setTimeout(() => (thumbQuery = q), 1200);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  });

  $effect(() => {
    const snapshot = $state.snapshot(builder);
    const id = setTimeout(() => persist(snapshot), 400);
    return () => clearTimeout(id);
  });
</script>

<header class="header">
  <div class="container header-inner">
    <a class="brand" href="./" aria-label="Vibecard home">
      <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="6" width="28" height="20" rx="5" fill="currentColor" />
        <rect x="6.5" y="11" width="10" height="2.6" rx="1.3" class="cut" />
        <rect x="6.5" y="16.4" width="6.5" height="2.2" rx="1.1" class="cut" opacity=".7" />
        <circle cx="23" cy="16" r="4" class="cut" />
      </svg>
      <span>Vibecard</span>
    </a>
    <nav class="nav" aria-label="Sections">
      {#each NAV as [label, href] (href)}<a {href}>{label}</a>{/each}
      <a href="{REPO}#api-reference" target="_blank" rel="noreferrer">API</a>
    </nav>
    <div class="header-actions">
      <button class="header-icon" type="button" onclick={toggleScheme} aria-label="Switch to {scheme === 'dark' ? 'light' : 'dark'} mode">
        <Icon icon={scheme === 'dark' ? UI.sun : UI.moon} size={16} />
      </button>
      <a class="header-btn" href={REPO} target="_blank" rel="noreferrer">
        <Icon icon={BRAND_ICONS.github} size={16} /><span class="hide-sm">Star on GitHub</span>
      </a>
    </div>
  </div>
</header>

<section class="hero">
  <div class="container hero-inner">
    <div class="hero-copy">
      <div class="labels">
        <span class="Label Label--accent">v2</span>
        <span class="Label">Open source · MIT</span>
      </div>
      <h1>Build a profile card for your GitHub README</h1>
      <p class="lead">
        Vibecard turns one URL into a polished SVG card. Pick from {THEMES.length} themes, add any of
        {PLATFORMS.length} social platforms, and paste the snippet — no sign-up, no tracking.
      </p>
      <GithubImport />
    </div>
    <ul class="stats" aria-label="Highlights">
      <li><strong>{THEMES.length}</strong><span>themes</span></li>
      <li><strong>{PLATFORMS.length}</strong><span>platforms</span></li>
      <li><strong>0</strong><span>sign-ups</span></li>
    </ul>
  </div>
</section>

<main class="container layout">
  <div class="form">
    <Section id="profile" title="Profile" description="Your name, role and a short bio." icon={UI.user}>
      <ProfileFields />
    </Section>
    <Section id="links" title="Social links" description="Paste a username or a full profile URL." icon={UI.at}>
      <SocialFields />
    </Section>
    <Section id="topics" title="Topics" description="Languages, tools or interests, shown as tags." icon={UI.tag}>
      <SkillsInput />
    </Section>
    <Section id="theme" title="Theme" description="Every theme works with all of your content." icon={UI.layout}>
      <ThemePicker query={thumbQuery} />
    </Section>
    <Section id="appearance" title="Appearance" description="Override colours, pattern, avatar shape and motion." icon={UI.palette}>
      <StyleFields />
    </Section>
  </div>

  <aside class="preview" aria-label="Preview and embed code">
    <PreviewPanel query={previewQuery} />
  </aside>
</main>

<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <svg class="mark small" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="6" width="28" height="20" rx="5" fill="currentColor" />
      </svg>
      <span>© 2026 Balaqiang</span>
    </div>
    <nav class="footer-links" aria-label="Footer">
      <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>
      <a href="{REPO}#readme" target="_blank" rel="noreferrer">Docs</a>
      <a href="{REPO}#api-reference" target="_blank" rel="noreferrer">API</a>
      <a href="{REPO}/blob/main/LICENSE" target="_blank" rel="noreferrer">MIT License</a>
      <a href={ORIGINAL} target="_blank" rel="noreferrer">Inspired by Cardivo</a>
    </nav>
  </div>
</footer>

<style>
  .container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 32px);
  }

  /* -------------------------------------------------------------- header */
  .header {
    background: var(--header-bg);
    color: var(--header-fg);
    border-bottom: 1px solid var(--border);
  }
  :global([data-theme='light']) .header {
    border-bottom-color: transparent;
  }
  .header-inner {
    display: flex;
    align-items: center;
    gap: 24px;
    height: 64px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--header-fg);
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-decoration: none;
  }
  .mark {
    width: 32px;
    height: 32px;
  }
  .mark .cut {
    fill: var(--header-bg);
  }
  .nav {
    display: flex;
    gap: 4px;
  }
  .nav a {
    padding: 6px 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--header-fg);
    border-radius: var(--radius);
  }
  .nav a:hover {
    color: var(--header-muted);
    text-decoration: none;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }
  .header-icon,
  .header-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 32px;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    color: var(--header-fg);
    background: transparent;
    border: 1px solid #ffffff40;
    border-radius: var(--radius);
    cursor: pointer;
    text-decoration: none;
  }
  .header-icon {
    width: 32px;
  }
  .header-btn {
    padding: 0 12px;
  }
  .header-icon:hover,
  .header-btn:hover {
    border-color: var(--header-fg);
    text-decoration: none;
  }

  /* ---------------------------------------------------------------- hero */
  .hero {
    position: relative;
    overflow: hidden;
    background: var(--bg-muted);
    border-bottom: 1px solid var(--border);
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: -40% -10% auto auto;
    width: 640px;
    height: 640px;
    background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 18%, transparent), transparent);
    pointer-events: none;
  }
  .hero-inner {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    padding-top: 40px;
    padding-bottom: 36px;
  }
  .hero-copy {
    max-width: 680px;
  }
  .labels {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
  }
  h1 {
    font-size: clamp(28px, 4vw, 40px);
    line-height: 1.15;
    letter-spacing: -0.025em;
    margin-bottom: 12px;
  }
  .lead {
    font-size: 16px;
    line-height: 1.6;
    color: var(--fg-muted);
    margin-bottom: 22px;
  }
  .stats {
    display: flex;
    gap: 0;
    list-style: none;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    flex: none;
  }
  .stats li {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 96px;
    padding: 14px 16px;
    border-left: 1px solid var(--border);
  }
  .stats li:first-child {
    border-left: 0;
  }
  .stats strong {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 700;
    line-height: 1.1;
  }
  .stats span {
    font-size: 12px;
    color: var(--fg-muted);
  }

  /* -------------------------------------------------------------- layout */
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    gap: 24px;
    align-items: start;
    padding-top: 24px;
    padding-bottom: 48px;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }
  .preview {
    position: sticky;
    top: 16px;
    min-width: 0;
  }

  /* -------------------------------------------------------------- footer */
  .footer {
    border-top: 1px solid var(--border);
  }
  .footer-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-top: 28px;
    padding-bottom: 40px;
    font-size: 12px;
    color: var(--fg-muted);
  }
  .footer-brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .mark.small {
    width: 24px;
    height: 24px;
    color: var(--fg-muted);
  }
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
  }

  @media (max-width: 1080px) {
    .layout {
      grid-template-columns: minmax(0, 1fr);
    }
    .preview {
      position: static;
      order: -1;
    }
    .stats {
      display: none;
    }
  }
  @media (max-width: 760px) {
    .nav {
      display: none;
    }
  }
  @media (max-width: 480px) {
    .hide-sm {
      display: none;
    }
    .header-btn {
      width: 32px;
      padding: 0;
    }
  }
</style>
