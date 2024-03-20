<script lang="ts">
    import {marked} from 'marked'
    import PocketBase from 'pocketbase'
    import {onDestroy} from "svelte";

    export let data;
    const id = data.slug

    const pb = new PocketBase('https://uwowkeys.site.quack-lab.dev')
    let md = 'Loading...'

    pb.collection('entry').subscribe(id, function (e: any) {
        if (e.action === 'update') {
            md = e.record.content
        }
    })
    pb.collection('entry')
        .getOne(id, {fields: 'content'})
        .then((e: any) => {
            md = e.content
        })

    let edit = false
    let timer: number

    // TODO: Make auth somehow, figure it out

    function updateApi(content: string) {
        pb.collection('entry').update(id, {content})
        clearTimeout(timer)
    }

    function textChanged() {
        clearTimeout(timer)
        timer = setTimeout(() => {
            updateApi(md)
        }, 200)
    }

    function render(markdown: string) {
        let html: string = marked(markdown)
        html = html.replaceAll(/<ul>/g, '<ul class="list-disc pl-5">')
        html = html.replaceAll(/<ol>/g, '<ol class="list-decimal pl-5">')
        html = html.replaceAll(/<strong>/g, '<strong class="font-bold text-sky-400">')
        html = html.replaceAll(/<em>/g, '<em class="italic text-sky-400">')
        html = html.replaceAll(/<code>/g, '<code class="bg-gray-200 text-gray-800 px-1 rounded">')
        html = html.replaceAll(/<pre>/g, '<pre class="bg-gray-200 text-gray-800 px-1 rounded">')
        html = html.replaceAll(/<h1>/g, '<h1 class="text-4xl font-bold text-amber-700">')
        html = html.replaceAll(/<h2>/g, '<h2 class="text-3xl font-bold text-amber-700">')
        html = html.replaceAll(/<h3>/g, '<h3 class="text-2xl font-bold text-amber-700">')
        return html
    }

    onDestroy(() => {
        pb.collection('entry').unsubscribe()
    })
</script>

<template>
    <button class="w-20 btn capitalize"
            class:btn-outline={!edit}
            class:btn-info={edit}
            on:click={() => (edit = !edit)}>
        Edit
    </button>
    <div class="flex-1 items-center justify-start h-[80vh]">
        {#if edit}
        <textarea
                class="textarea min-h-[80vh] w-full"
                bind:value={md}
                on:keyup={textChanged}/>
        {:else}
            <div class="px-10 py-4 h-full w-full text-xl">{@html render(md)}</div>
        {/if}
    </div>
</template>
