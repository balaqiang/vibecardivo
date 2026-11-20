<script lang="ts">
  import { UI } from '../icons';
  import Icon from './Icon.svelte';

  let { code, label = 'Copy to clipboard' }: { code: string; label?: string } = $props();
  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  export async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const area = document.createElement('textarea');
      area.value = code;
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    copied = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied = false), 1600);
  }
</script>

<div class="code">
  <pre><code>{code}</code></pre>
  <button class="btn btn-sm copy" class:done={copied} type="button" onclick={copy} aria-label={label} title={copied ? 'Copied!' : label}>
    <Icon icon={copied ? UI.check : UI.copy} size={14} />
  </button>
</div>

<style>
  .code {
    position: relative;
    background: var(--bg-muted);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  pre {
    margin: 0;
    padding: 16px 52px 16px 16px;
    max-height: 220px;
    overflow: auto;
    font-family: var(--mono);
    font-size: 12px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .copy {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    padding: 0;
    color: var(--fg-muted);
  }
  .copy.done {
    color: var(--success);
    border-color: var(--success);
  }
</style>
