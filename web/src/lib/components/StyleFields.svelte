<script lang="ts">
  import { CLASSIC_PATTERNS, CUSTOM_PATTERNS, HERO_PATTERNS } from '@core/catalog/patterns';
  import { ANIMATIONS, AVATAR_SHAPES, getThemeMeta } from '@core/catalog/themes';
  import { builder } from '../state.svelte';
  import ColorField from './ColorField.svelte';

  const theme = $derived(getThemeMeta(builder.theme));
  const others = HERO_PATTERNS.filter((p) => !(CLASSIC_PATTERNS as readonly string[]).includes(p));
  const label = (id: string) => id.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
  const hasPattern = $derived(builder.pattern ? builder.pattern !== 'none' : theme.pattern !== null);
</script>

<div class="form-row colors">
  <ColorField label="Background" bind:value={builder.backgroundColor} fallback={theme.palette.background} />
  <ColorField label="Text" bind:value={builder.fontColor} fallback={theme.palette.text} />
  <ColorField label="Accent" bind:value={builder.iconColor} fallback={theme.palette.accent} />
</div>
<p class="note tip">Changing only the background? Text colours adjust automatically to stay readable.</p>

<div class="form-row">
  <label class="form-group">
    <span class="form-label">Background pattern</span>
    <select class="form-control" bind:value={builder.pattern}>
      <option value="">Theme default{theme.pattern ? ` (${label(theme.pattern)})` : ' (none)'}</option>
      <option value="none">None</option>
      <optgroup label="Classic">
        {#each CLASSIC_PATTERNS as p (p)}<option value={p}>{label(p)}</option>{/each}
      </optgroup>
      <optgroup label="Vibecard">
        {#each CUSTOM_PATTERNS as p (p)}<option value={p}>{label(p)}</option>{/each}
      </optgroup>
      <optgroup label="Hero Patterns">
        {#each others as p (p)}<option value={p}>{label(p)}</option>{/each}
      </optgroup>
    </select>
  </label>
  {#if hasPattern && builder.pattern}
    <ColorField label="Pattern colour" bind:value={builder.colorPattern} fallback={theme.palette.pattern} />
  {/if}
</div>

{#if hasPattern}
  <label class="form-group">
    <span class="form-label">
      Pattern opacity
      <span class="value">{builder.opacity ?? theme.patternOpacity}</span>
      {#if builder.opacity !== null}<button class="link" type="button" onclick={() => (builder.opacity = null)}>Reset</button>{/if}
    </span>
    <input type="range" min="0" max="1" step="0.02" value={builder.opacity ?? theme.patternOpacity} oninput={(e) => (builder.opacity = Number(e.currentTarget.value))} />
  </label>
{/if}

<div class="form-group">
  <span class="form-label">Avatar shape</span>
  <div class="SegmentedControl" role="group" aria-label="Avatar shape">
    <button type="button" aria-pressed={!builder.avatarShape} onclick={() => (builder.avatarShape = '')}>Default</button>
    {#each AVATAR_SHAPES as shape (shape)}
      <button type="button" aria-pressed={builder.avatarShape === shape} onclick={() => (builder.avatarShape = shape)}>
        <span class="shape {shape}" aria-hidden="true"></span>{shape}
      </button>
    {/each}
  </div>
</div>

<label class="form-group">
  <span class="form-label">
    Corner radius
    <span class="value">{builder.radius ?? theme.radius}px</span>
    {#if builder.radius !== null}<button class="link" type="button" onclick={() => (builder.radius = null)}>Reset</button>{/if}
  </span>
  <input type="range" min="0" max="48" step="1" value={builder.radius ?? theme.radius} oninput={(e) => (builder.radius = Number(e.currentTarget.value))} />
</label>

<div class="form-group">
  <span class="form-label">Animation</span>
  <div class="SegmentedControl" role="group" aria-label="Animation">
    {#each ANIMATIONS as anim (anim)}
      <button type="button" aria-pressed={builder.animation === anim} onclick={() => (builder.animation = anim)}>
        {anim === 'auto' ? `Auto (${theme.animation})` : anim}
      </button>
    {/each}
  </div>
  <span class="note">Visitors with “reduce motion” enabled always see a still card.</span>
</div>

<style>
  .colors {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  .tip {
    margin-top: -8px;
  }
  .value {
    margin-left: auto;
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 400;
    color: var(--fg-muted);
  }
  .link {
    all: unset;
    font-size: 12px;
    font-weight: 400;
    color: var(--accent);
    cursor: pointer;
  }
  .link:hover {
    text-decoration: underline;
  }
  .shape {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: currentColor;
    opacity: 0.75;
  }
  .shape.circle {
    border-radius: 50%;
  }
  .shape.rounded {
    border-radius: 3px;
  }
  .shape.hexagon {
    clip-path: polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%);
  }
</style>
