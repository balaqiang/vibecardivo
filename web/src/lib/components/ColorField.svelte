<script lang="ts">
  import { UI } from '../icons';
  import Icon from './Icon.svelte';

  let { label, value = $bindable(''), fallback }: { label: string; value?: string; fallback: string } = $props();

  const shown = $derived(/^#[0-9a-f]{6}$/i.test(value) ? value : fallback);
  let text = $state('');
  $effect(() => {
    text = value;
  });

  function commit() {
    const v = text.trim();
    if (!v) value = '';
    else if (/^#?[0-9a-f]{6}$/i.test(v)) value = v.startsWith('#') ? v.toLowerCase() : `#${v.toLowerCase()}`;
    else text = value;
  }
</script>

<div class="form-group">
  <span class="form-label">{label}</span>
  <div class="form-control input-group color">
    <label class="swatch" style:background={shown}>
      <span class="sr-only">Pick {label.toLowerCase()} colour</span>
      <input type="color" value={shown} oninput={(e) => (value = e.currentTarget.value)} />
    </label>
    <input class="hex" bind:value={text} onchange={commit} placeholder={fallback} spellcheck="false" aria-label="{label} hex value" />
    {#if value}
      <button class="btn-octicon" type="button" aria-label="Reset {label.toLowerCase()} to theme default" onclick={() => (value = '')}>
        <Icon icon={UI.reset} size={14} />
      </button>
    {:else}
      <span class="Label">Default</span>
    {/if}
  </div>
</div>

<style>
  .color {
    padding-left: 4px;
    padding-right: 4px;
  }
  .swatch {
    position: relative;
    width: 22px;
    height: 22px;
    flex: none;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px #1f232826;
    cursor: pointer;
  }
  .swatch input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .hex {
    font-family: var(--mono);
    font-size: 13px !important;
    text-transform: lowercase;
  }
  .btn-octicon {
    width: 24px;
    height: 24px;
  }
</style>
