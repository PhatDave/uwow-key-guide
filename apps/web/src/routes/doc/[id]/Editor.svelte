<script lang="ts">
    import 'carta-md/default.css'; /* Default theme */
    import '@cartamd/plugin-attachment/default.css';
    import {Carta, CartaEditor} from 'carta-md';
    import {attachment} from '@cartamd/plugin-attachment';
    import { createEventDispatcher } from 'svelte';

    import {PBImgToUrl} from '$lib/pocketbase/index.js';
    import {onDestroy, onMount} from "svelte";
    import ImageService from "$lib/pocketbase/models/images";

    // The content of the editor
    export let content: string;
    export let documentId: string;
    const dispatch = createEventDispatcher();
    let ticker: number;

    const carta = new Carta({
        // Remember to use a sanitizer to prevent XSS attacks!
        // More on that below
        // sanitizer: ...
        extensions: [
            attachment({
                upload: async file => {
                    const record = await ImageService.Save(file, documentId);
                    return PBImgToUrl(record, record.image);
                }
            })
        ]
    });

    onMount(() => {
        ticker = setInterval(() => {
            dispatch('update', {content: content});
        }, 300);
    });
    onDestroy(() => {
        clearInterval(ticker);
        dispatch('update', {content: content});
    });
</script>

<CartaEditor bind:value={content} {carta}/>

<style>
    /* Set your custom monospace font */
    :global(.carta-font-code) {
        font-family: '...', monospace;
    }

    :global(.carta-editor) {
        @apply bg-base-100;
    }
</style>
