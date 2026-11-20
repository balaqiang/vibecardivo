<script lang="ts">
  import { LIMITS } from '@core/catalog/limits';
  import { UI } from '../icons';
  import { builder } from '../state.svelte';
  import Icon from './Icon.svelte';

  let draft = $state('');

  function add() {
    const items = draft
      .split(',')
      .map((s) => s.trim().slice(0, LIMITS.skill))
      .filter(Boolean);
    for (const item of items) {
      if (builder.skills.length >= LIMITS.skills) break;
      if (!builder.skills.some((s) => s.toLowerCase() === item.toLowerCase())) builder.skills.push(item);
    }
    draft = '';
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !draft && builder.skills.length) {
      builder.skills.pop();
    }
  }
</script>

<div class="form-group">
  <label class="form-label" for="skill-input">Topics</label>
  <div class="form-control tags">
    {#each builder.skills as skill, i (skill)}
      <span class="topic-tag">
        {skill}
        <button type="button" aria-label="Remove {skill}" onclick={() => builder.skills.splice(i, 1)}>
          <Icon icon={UI.x} size={12} />
        </button>
      </span>
    {/each}
    {#if builder.skills.length < LIMITS.skills}
      <input
        id="skill-input"
        bind:value={draft}
        {onkeydown}
        onblur={add}
        placeholder={builder.skills.length ? 'Add another…' : 'e.g. TypeScript, Rust, Figma'}
      />
    {/if}
  </div>
  <span class="note">Press Enter or comma to add. Up to {LIMITS.skills} topics ({builder.skills.length} used).</span>
</div>

<style>
  .tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    min-height: 40px;
    padding: 6px 8px;
    cursor: text;
  }
  .topic-tag button {
    all: unset;
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
  }
  .topic-tag button:hover {
    background: color-mix(in srgb, var(--accent) 20%, transparent);
  }
  input {
    all: unset;
    flex: 1;
    min-width: 160px;
    font-size: 14px;
    padding: 0 4px;
  }
  input::placeholder {
    color: var(--fg-muted);
    opacity: 0.8;
  }
</style>
