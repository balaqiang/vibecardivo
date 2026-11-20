<script lang="ts">
  import { getPlatform, PLATFORMS } from '@core/catalog/platforms';
  import { getThemeMeta } from '@core/catalog/themes';
  import { UI } from '../icons';
  import { builder, moveSocial, setSocial } from '../state.svelte';
  import Icon from './Icon.svelte';

  let expanded = $state(false);
  let search = $state('');

  const max = $derived(getThemeMeta(builder.theme).maxSocials);
  const filled = $derived(builder.order.filter((id) => builder.socials[id]?.trim()));
  const visible = $derived.by(() => {
    const q = search.trim().toLowerCase();
    if (q) return PLATFORMS.filter((p) => p.label.toLowerCase().includes(q) || p.id.includes(q));
    return expanded ? PLATFORMS : PLATFORMS.filter((p) => p.popular || builder.socials[p.id]?.trim());
  });
</script>

{#if filled.length}
  <div class="Box order">
    <div class="Box-header order-head">
      <span class="Box-title">Shown on your card</span>
      <span class="Counter">{Math.min(filled.length, max)} / {max}</span>
      <span class="note grow">The {getThemeMeta(builder.theme).name} theme fits {max} links, in this order.</span>
    </div>
    <ol>
      {#each filled as id, i (id)}
        {@const p = getPlatform(id)}
        {#if p}
          <li class="Box-row" class:hidden={i >= max}>
            <span class="brand" style:--brand={p.icon.brand ?? 'var(--fg)'}><Icon icon={p.icon} size={14} /></span>
            <span class="handle"><b>{p.label}</b><span>{builder.socials[id]}</span></span>
            {#if i >= max}<span class="Label">Hidden</span>{/if}
            <span class="tools">
              <button class="btn-octicon" type="button" aria-label="Move {p.label} up" disabled={i === 0} onclick={() => moveSocial(id, -1)}><Icon icon={UI.up} size={16} /></button>
              <button class="btn-octicon" type="button" aria-label="Move {p.label} down" disabled={i === filled.length - 1} onclick={() => moveSocial(id, 1)}><Icon icon={UI.down} size={16} /></button>
              <button class="btn-octicon danger" type="button" aria-label="Remove {p.label}" onclick={() => setSocial(id, '')}><Icon icon={UI.x} size={16} /></button>
            </span>
          </li>
        {/if}
      {/each}
    </ol>
  </div>
{/if}

<label class="form-control input-group">
  <span class="leading"><Icon icon={UI.search} size={16} /></span>
  <span class="sr-only">Search platforms</span>
  <input bind:value={search} placeholder="Search {PLATFORMS.length} platforms…" />
</label>

<div class="platforms">
  {#each visible as p (p.id)}
    <label class="form-group platform">
      <span class="form-label small">
        <span class="brand" style:--brand={p.icon.brand ?? 'var(--fg)'}><Icon icon={p.icon} size={13} /></span>
        {p.label}
      </span>
      <span class="form-control input-group">
        {#if p.prefix}<span class="prefix">{p.prefix}</span>{/if}
        <input
          value={builder.socials[p.id] ?? ''}
          oninput={(e) => setSocial(p.id, e.currentTarget.value)}
          placeholder={p.placeholder}
          autocomplete="off"
          spellcheck="false"
        />
      </span>
    </label>
  {:else}
    <p class="note">No platform matches “{search}”.</p>
  {/each}
</div>

{#if !search}
  <button class="btn btn-sm more" type="button" onclick={() => (expanded = !expanded)}>
    <Icon icon={expanded ? UI.up : UI.down} size={14} />
    {expanded ? 'Show fewer platforms' : `Show all ${PLATFORMS.length} platforms`}
  </button>
{/if}

<style>
  .order ol {
    list-style: none;
  }
  .order-head {
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 16px;
  }
  .grow {
    flex: 1 1 100%;
  }
  .hidden {
    opacity: 0.55;
  }
  .handle {
    flex: 1;
    min-width: 0;
    display: flex;
    gap: 8px;
    overflow: hidden;
    white-space: nowrap;
  }
  .handle b {
    font-weight: 600;
  }
  .handle span {
    color: var(--fg-muted);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tools {
    display: flex;
  }
  .danger:hover:not(:disabled) {
    color: var(--danger);
  }
  .brand {
    display: inline-flex;
    color: var(--brand);
  }
  :global([data-theme='dark']) .brand {
    color: color-mix(in srgb, var(--brand) 55%, white);
  }
  .platforms {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px 16px;
  }
  .small {
    font-size: 13px;
  }
  .prefix {
    font-size: 13px;
    color: var(--fg-muted);
    white-space: nowrap;
    max-width: 55%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: -6px;
  }
  .more {
    align-self: flex-start;
  }
</style>
