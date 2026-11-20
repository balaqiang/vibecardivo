<script lang="ts">
  import type { IconDef } from '@core/catalog/platforms';

  let { icon, size = 16, color }: { icon: IconDef; size?: number; color?: string } = $props();
</script>

<svg
  class="icon"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  aria-hidden="true"
  fill={icon.stroke ? 'none' : 'currentColor'}
  stroke={icon.stroke ? 'currentColor' : 'none'}
  stroke-width={icon.stroke ? 2 : 0}
  stroke-linecap="round"
  stroke-linejoin="round"
  style:color
><path d={icon.path} /></svg>

<style>
  .icon {
    flex: none;
    display: block;
  }
</style>
