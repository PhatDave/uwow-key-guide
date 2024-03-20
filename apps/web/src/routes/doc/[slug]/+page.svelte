<script lang="ts">
    import {marked} from 'marked'
    import PocketBase from 'pocketbase'
    import {onDestroy} from "svelte";
    import type {Document} from "$lib/types";

    export let data;
    const id = data.slug
    let doc: Document = {content: '', title: '', images: []}
    const pb = new PocketBase('https://uwowkeys.site.quack-lab.dev')

    pb.collection('entry').subscribe(id, function (e: any) {
        if (e.action === 'update') {
            doc = e.record
        }
    })
    pb.collection('entry')
        .getOne(id, {fields: 'content,title,images'})
        .then((e: any) => {
            doc = e
        })

    let edit = false
    let timer: number

    // TODO: Make auth somehow, figure it out

    function updateApi(content: string) {
        pb.collection('entry').update(id, {content})
        // No, it is automagically sent to the server, (IF you use the correct PB instance)
        // It is - and it's simple
        // I think
        clearTimeout(timer)
    }

    function textChanged() {
        console.log("Text changed");
        clearTimeout(timer)
        timer = setTimeout(() => {
            updateApi(doc.content)
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
    <div class="flex items-center">
        <button
                class="btn w-20 capitalize"
                class:btn-outline={!edit}
                class:btn-info={edit}
                on:click={() => (edit = !edit)}>
            Edit
        </button>
        <div class="flex flex-grow items-center justify-center">
            <h1 class="text-5xl text-amber-700">{doc.title}</h1>
        </div>
    </div>

    <div class="h-[80vh] flex-1 items-center justify-start">
        {#if edit}
			<textarea
                    class="textarea min-h-[80vh] w-full"
                    bind:value={doc.content}
                    on:keyup={textChanged}/>
        {:else}
            <div class="h-full w-full px-10 py-4 text-xl">
                {@html render(doc.content)}
            </div>
        {/if}
    </div>
</template>
