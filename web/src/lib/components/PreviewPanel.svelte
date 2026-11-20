<script lang="ts">
  import { THEMES } from '@core/catalog/themes';
  import { UI } from '../icons';
  import { builder, resetBuilder } from '../state.svelte';
  import CodeBlock from './CodeBlock.svelte';
  import Icon from './Icon.svelte';

  let { query }: { query: string } = $props();

  type Tab = 'md' | 'html' | 'picture' | 'url';
  const TABS: Array<[Tab, string]> = [
    ['md', 'Markdown'],
    ['html', 'HTML'],
    ['picture', 'Light + dark'],
    ['url', 'URL'],
  ];

  let tab = $state<Tab>('md');
  // Start on the same background as the site, like a README seen in that scheme.
  let stage = $state<'light' | 'dark'>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  let status = $state<'loading' | 'ready' | 'error'>('loading');
  let shared = $state(false);
  let block = $state<{ copy: () => Promise<void> }>();
  let copied = $state(false);

  const readBase = () => {
    try {
      return localStorage.getItem('vibecard:base') || location.origin;
    } catch {
      return location.origin;
    }
  };
  let base = $state(readBase());
  $effect(() => {
    try {
      localStorage.setItem('vibecard:base', base);
    } catch {}
  });

  const DARK = new Set(['aurora', 'hacker', 'lofi', 'synthwave', 'dracula', 'nord']);
  let darkTheme = $state(DARK.has(builder.theme) ? builder.theme : 'aurora');

  const src = $derived(`/api?${query}`);
  $effect(() => {
    void src;
    status = 'loading';
  });

  const origin = $derived(base.trim().replace(/\/+$/, '') || location.origin);
  const absolute = $derived(`${origin}/api?${query}`);
  const darkUrl = $derived.by(() => {
    const q = new URLSearchParams(query);
    if (darkTheme === 'classic') q.delete('theme');
    else q.set('theme', darkTheme);
    return `${origin}/api?${q}`;
  });
  const alt = $derived(`${builder.name || 'My'}'s profile card`);
  const attr = (url: string) => url.replace(/&/g, '&amp;');

  const code = $derived.by(() => {
    switch (tab) {
      case 'md':
        return `![${alt}](${absolute})`;
      case 'html':
        return `<img src="${attr(absolute)}" alt="${alt}" width="600" />`;
      case 'picture':
        return `<picture>\n  <source media="(prefers-color-scheme: dark)" srcset="${attr(darkUrl)}" />\n  <img src="${attr(absolute)}" alt="${alt}" width="600" />\n</picture>`;
      case 'url':
        return absolute;
    }
  });

  async function copySnippet() {
    await block?.copy();
    copied = true;
    setTimeout(() => (copied = false), 1600);
  }

  async function download() {
    const res = await fetch(src);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vibecard-${(builder.name || 'card').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function share() {
    await navigator.clipboard.writeText(location.href).catch(() => {});
    shared = true;
    setTimeout(() => (shared = false), 1600);
  }

  function startOver() {
    if (confirm('Clear every field and start from a blank card?')) resetBuilder();
  }
</script>

<div class="stack">
  <section class="Box" aria-labelledby="preview-title">
    <header class="Box-header">
      <h2 class="Box-title grow" id="preview-title">Preview</h2>
      {#if status === 'loading' && builder.name.trim()}<span class="note">Rendering…</span>{/if}
      <div class="SegmentedControl" role="group" aria-label="Preview background">
        <button type="button" aria-pressed={stage === 'light'} onclick={() => (stage = 'light')}><Icon icon={UI.sun} size={14} />Light</button>
        <button type="button" aria-pressed={stage === 'dark'} onclick={() => (stage = 'dark')}><Icon icon={UI.moon} size={14} />Dark</button>
      </div>
    </header>

    <div class="stage {stage}">
      {#if builder.name.trim()}
        <img {src} {alt} class:loading={status === 'loading'} onload={() => (status = 'ready')} onerror={() => (status = 'error')} />
        {#if status === 'error'}<p class="message">The preview failed to load. Check the browser console for details.</p>{/if}
      {:else}
        <p class="message">Enter your name to see a preview.</p>
      {/if}
    </div>

    <footer class="Box-footer">
      <button class="btn" type="button" onclick={download}><Icon icon={UI.download} size={16} />Download SVG</button>
      <a class="btn" href={src} target="_blank" rel="noreferrer"><Icon icon={UI.external} size={16} />Open image</a>
      <button class="btn" type="button" onclick={share}>
        <Icon icon={shared ? UI.check : UI.link} size={16} />{shared ? 'Link copied' : 'Copy builder link'}
      </button>
      <button class="btn btn-invisible btn-danger end" type="button" onclick={startOver}><Icon icon={UI.reset} size={16} />Start over</button>
    </footer>
  </section>

  <section class="Box" aria-labelledby="embed-title">
    <h2 class="sr-only" id="embed-title">Embed in your README</h2>
    <div class="UnderlineNav" role="tablist" aria-label="Snippet format">
      {#each TABS as [id, label] (id)}
        <button class="UnderlineNav-item" type="button" role="tab" aria-selected={tab === id} onclick={() => (tab = id)}>
          {#if id === 'md'}<Icon icon={UI.book} size={16} />{:else if id === 'html'}<Icon icon={UI.code} size={16} />{:else if id === 'picture'}<Icon icon={UI.moon} size={16} />{:else}<Icon icon={UI.link} size={16} />{/if}
          {label}
        </button>
      {/each}
      <button class="btn btn-primary btn-sm copy-main" type="button" onclick={copySnippet}>
        <Icon icon={copied ? UI.check : UI.copy} size={14} />{copied ? 'Copied!' : 'Copy'}
      </button>
    </div>

    <div class="Box-body embed">
      {#if tab === 'picture'}
        <div class="picture-row">
          <label class="form-group">
            <span class="form-label">Theme for dark mode</span>
            <select class="form-control" bind:value={darkTheme}>
              {#each THEMES as theme (theme.id)}<option value={theme.id}>{theme.name}</option>{/each}
            </select>
          </label>
          <p class="note">GitHub swaps to this card automatically for visitors who use dark mode.</p>
        </div>
      {:else}
        <p class="note">
          {tab === 'md'
            ? 'Paste this into the README of your profile repository (github.com/<you>/<you>).'
            : tab === 'html'
              ? 'Use HTML when you want to control the width or centre the card.'
              : 'The raw image URL. Cards are cached for an hour, so edits can take a moment to show up on GitHub.'}
        </p>
      {/if}

      <CodeBlock {code} bind:this={block} />

      <label class="form-group">
        <span class="form-label">Base URL <span class="Label">self-hosting</span></span>
        <input class="form-control mono" bind:value={base} spellcheck="false" />
        <span class="note">Where your Vibecard API is deployed. Defaults to this site.</span>
      </label>
    </div>
  </section>
</div>

<style>
  .stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .grow {
    flex: 1;
  }
  .stage {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 220px;
    padding: clamp(16px, 3vw, 32px);
    background-size: 16px 16px;
  }
  .stage.light {
    background-color: #ffffff;
    background-image: radial-gradient(#d1d9e0 1px, transparent 1px);
  }
  .stage.dark {
    background-color: #0d1117;
    background-image: radial-gradient(#3d444d 1px, transparent 1px);
  }
  .stage img {
    display: block;
    width: 100%;
    max-width: 640px;
    height: auto;
    aspect-ratio: 2 / 1;
    transition: opacity 120ms;
  }
  .stage img.loading {
    opacity: 0.6;
  }
  .message {
    font-size: 13px;
    color: #59636e;
  }
  .dark .message {
    color: #9198a1;
  }
  .end {
    margin-left: auto;
  }
  .copy-main {
    margin-left: auto;
    flex: none;
  }
  .embed {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .picture-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .mono {
    font-family: var(--mono);
    font-size: 13px;
  }
  @media (max-width: 560px) {
    .end {
      margin-left: 0;
    }
    /* Keep all four tabs visible; the code block keeps its own copy button. */
    .copy-main,
    .UnderlineNav-item :global(svg) {
      display: none;
    }
  }
</style>
