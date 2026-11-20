<script lang="ts">
  import { THEMES } from '@core/catalog/themes';
  import { UI } from '../icons';
  import { builder } from '../state.svelte';
  import Icon from './Icon.svelte';

  let { query }: { query: string } = $props();

  const thumb = (id: string) => {
    const q = new URLSearchParams(query);
    q.set('theme', id);
    q.set('animation', 'none');
    return `/api?${q}`;
  };
</script>

<div class="themes" role="radiogroup" aria-label="Card theme">
  {#each THEMES as theme (theme.id)}
    {@const active = builder.theme === theme.id}
    <button type="button" class="theme" class:active role="radio" aria-checked={active} onclick={() => (builder.theme = theme.id)}>
      <span class="thumb" style:background={theme.palette.background}>
        <img src={thumb(theme.id)} alt="" loading="lazy" width="320" height="160" />
      </span>
      <span class="meta">
        <span class="radio" aria-hidden="true">{#if active}<Icon icon={UI.check} size={12} />{/if}</span>
        <span class="name">{theme.name}</span>
        <span class="Label">{theme.tags[0]}</span>
      </span>
      <span class="desc">{theme.description}</span>
    </button>
  {/each}
</div>

<style>
  .themes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
    gap: 12px;
  }
  .theme {
    all: unset;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 8px 10px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    transition:
      border-color 80ms,
      box-shadow 80ms;
  }
  .theme:hover {
    border-color: var(--fg-muted);
    box-shadow: var(--shadow-md);
  }
  .theme:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .theme.active {
    border-color: var(--accent);
    box-shadow: inset 0 0 0 1px var(--accent);
  }
  .thumb {
    display: block;
    aspect-ratio: 2 / 1;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--border-muted);
  }
  .thumb img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .radio {
    display: grid;
    place-items: center;
    width: 16px;
    height: 16px;
    flex: none;
    border-radius: 50%;
    border: 1px solid var(--border);
    color: #fff;
  }
  .active .radio {
    background: var(--accent);
    border-color: var(--accent);
  }
  .name {
    flex: 1;
    font-weight: 600;
    font-size: 14px;
  }
  .desc {
    font-size: 12px;
    line-height: 1.4;
    color: var(--fg-muted);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }
</style>
