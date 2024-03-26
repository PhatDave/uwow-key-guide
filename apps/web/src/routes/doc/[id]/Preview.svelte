<script lang="ts">
  import 'github-markdown-css/github-markdown-dark.css';
  // TODO: This doesn't look very good in light mode

  import { marked } from 'marked';
  import { fade } from 'svelte/transition';

  export let content: string;

  async function render(content: string) {
    // Extend this render however you want
    return await marked(content);
  }
</script>

<article class="markdown-body !bg-base-100 h-full outline outline-1">
  {#await render(content)}
    <div class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-4">
      <p class="text-4xl">Loading...</p>
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:then content}
    <div transition:fade>
      {@html content}
    </div>
  {/await}
</article>

<style>
  .markdown-body {
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
  }

  @media (max-width: 767px) {
    .markdown-body {
      padding: 15px;
    }
  }
</style>
