<script lang="ts">
    import 'github-markdown-css/github-markdown-dark.css';
    import {marked} from 'marked';
    import {fade} from 'svelte/transition';

    export let content: string;

    async function render(content: string) {
        let rendered = await marked(content);
        return rendered;
    }
</script>

<article class="markdown-body !bg-base-100 w-full h-full outline outline-1">
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
        min-width: 20rem;
        max-width: 75rem;
        margin: 0 auto;
        padding: 45px;
        font-size: 1.2rem;
    }

    @media (max-width: 767px) {
        .markdown-body {
            padding: 15px;
        }
    }

    :global(.markdown-body ol) {
        @apply !list-decimal;
    }

    :global(.markdown-body h1,
        .markdown-body h2,
        .markdown-body h3,
        .markdown-body h4,
        .markdown-body h5,
        .markdown-body strong:not(h1 > strong),
        .markdown-body strong:not(h2 > strong),
        .markdown-body strong:not(h3 > strong),
        .markdown-body strong:not(h4 > strong),
        .markdown-body strong:not(h5 > strong),
        .markdown-body em:not(strong > em)) {
        @apply bg-gradient-to-r from-sky-300 to-purple-300 text-base-100 p-2 rounded-lg text-transparent bg-clip-text inline-block p-0
    }
</style>
