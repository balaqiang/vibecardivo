<script lang="ts">
  import { LIMITS } from '@core/catalog/limits';
  import { builder } from '../state.svelte';
</script>

<div class="form-row">
  <label class="form-group">
    <span class="form-label">Name <span class="req" aria-hidden="true">*</span></span>
    <input class="form-control" bind:value={builder.name} maxlength={LIMITS.name} placeholder="Ada Lovelace" required />
  </label>
  <label class="form-group">
    <span class="form-label">Role</span>
    <input class="form-control" bind:value={builder.role} maxlength={LIMITS.role} placeholder="Frontend Engineer" />
  </label>
</div>

<label class="form-group">
  <span class="form-label">Bio</span>
  <textarea class="form-control" rows="3" bind:value={builder.description} maxlength={LIMITS.description} placeholder="Tell people a little about yourself"></textarea>
  <span class="note split">
    <span>Shown under your name. Emoji are welcome.</span>
    <span class:warn={builder.description.length > LIMITS.description - 20}>{builder.description.length} / {LIMITS.description}</span>
  </span>
</label>

<label class="form-group">
  <span class="form-label">Avatar URL</span>
  <input class="form-control" type="url" bind:value={builder.image} placeholder="https://…" disabled={builder.hideAvatar} />
  <span class="note">Leave empty to use your GitHub avatar, or an initials badge when no GitHub account is set.</span>
</label>
<label class="form-checkbox">
  <input type="checkbox" bind:checked={builder.hideAvatar} />
  Don’t show an avatar
</label>

<div class="form-row">
  <label class="form-group">
    <span class="form-label">Location</span>
    <input class="form-control" bind:value={builder.location} maxlength={LIMITS.location} placeholder="Bali, Indonesia" />
  </label>
  <label class="form-group">
    <span class="form-label">Website</span>
    <input class="form-control" bind:value={builder.site} maxlength={LIMITS.site} placeholder="https://yoursite.dev" />
  </label>
</div>

<style>
  .req {
    color: var(--danger);
  }
  .split {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  .warn {
    color: var(--attention);
    font-weight: 600;
  }
</style>
