<script lang="ts">
  import { BRAND_ICONS } from '@core/catalog/icons.generated';
  import { UI } from '../icons';
  import { builder, setSocial } from '../state.svelte';
  import Icon from './Icon.svelte';

  let username = $state(builder.socials.github ?? '');
  let status = $state<'idle' | 'loading' | 'done' | 'error'>('idle');
  let message = $state('');

  interface GithubUser {
    login: string;
    name: string | null;
    bio: string | null;
    blog: string | null;
    location: string | null;
    twitter_username: string | null;
  }

  async function importProfile(event: SubmitEvent) {
    event.preventDefault();
    const login = username
      .trim()
      .replace(/^@/, '')
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\/.*$/, '');
    if (!login) return;
    status = 'loading';
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!res.ok) {
        status = 'error';
        message =
          res.status === 404
            ? `No GitHub user named “${login}”.`
            : res.status === 403
              ? 'GitHub rate limit reached — try again in a few minutes.'
              : 'GitHub returned an error. Please try again.';
        return;
      }
      const user = (await res.json()) as GithubUser;
      builder.name = user.name || user.login;
      if (user.bio) builder.description = user.bio.replace(/\s+/g, ' ').trim();
      builder.location = user.location ?? '';
      builder.site = user.blog ?? '';
      builder.image = '';
      builder.hideAvatar = false;
      setSocial('github', user.login);
      if (user.twitter_username) setSocial('x', user.twitter_username);
      status = 'done';
      message = `Imported @${user.login}. Fine-tune anything below.`;
    } catch {
      status = 'error';
      message = 'Could not reach GitHub. Check your connection.';
    }
  }
</script>

<form class="import" onsubmit={importProfile}>
  <label class="form-control input-group field">
    <span class="leading"><Icon icon={BRAND_ICONS.github} size={16} /></span>
    <span class="sr-only">GitHub username</span>
    <input bind:value={username} placeholder="Your GitHub username" autocomplete="off" spellcheck="false" />
  </label>
  <button class="btn btn-primary" type="submit" disabled={status === 'loading'}>
    {status === 'loading' ? 'Importing…' : 'Import profile'}
  </button>
</form>
{#if status === 'done' || status === 'error'}
  <p class="status" class:error={status === 'error'} role="status">
    <Icon icon={status === 'error' ? UI.info : UI.check} size={14} />{message}
  </p>
{/if}

<style>
  .import {
    display: flex;
    gap: 8px;
    max-width: 520px;
  }
  .field {
    flex: 1;
    height: 40px;
  }
  .field input {
    height: 38px;
  }
  .import .btn {
    height: 40px;
    padding: 0 16px;
  }
  .status {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    font-size: 13px;
    color: var(--success);
  }
  .status.error {
    color: var(--danger);
  }
  @media (max-width: 480px) {
    .import {
      flex-direction: column;
    }
  }
</style>
