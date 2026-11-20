<script lang="ts">
  import type { IconDef } from '@core/catalog/platforms';
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';

  let {
    id,
    title,
    description,
    icon,
    aside,
    children,
  }: {
    id: string;
    title: string;
    description: string;
    icon: IconDef;
    aside?: Snippet;
    children: Snippet;
  } = $props();
</script>

<section class="Box section" {id} aria-labelledby="{id}-title">
  <header class="Box-header">
    <span class="icon"><Icon {icon} size={16} /></span>
    <div class="titles">
      <h2 class="Box-title" id="{id}-title">{title}</h2>
      <p class="note">{description}</p>
    </div>
    {#if aside}<div class="aside">{@render aside()}</div>{/if}
  </header>
  <div class="Box-body body">{@render children()}</div>
</section>

<style>
  .section {
    scroll-margin-top: 16px;
  }
  .icon {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    flex: none;
    color: var(--fg-muted);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .titles {
    flex: 1;
    min-width: 0;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
