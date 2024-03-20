<script lang="ts">
    import {marked} from 'marked'
    import {pb} from '$lib/pocketbase'
    import {onDestroy} from "svelte";
    import type {Document} from "$lib/types";
    import {user} from "$stores/user";

    export let data;
    const id = data.slug
    let doc: Document

    pb.collection('entry').subscribe(id, function (e: any) {
        if (e.action === 'update') {
            doc = e.record
        }
    })
    const promise = pb.collection('entry')
        .getOne(id, {fields: 'content,title,images'})
    promise.then((e: any) => {
        doc = e
    })

    let edit = false
    let timer: number

    function updateApi(content: string) {
        // For some reason when this is called from a user that is not authenticated it returns 404
        // It also throws an error from the sdk
        // Whatever, don't care, as long as it actually prevents non admins from using the api
        pb.collection('entry').update(id, {content})
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

    let canEdit = false
    $: {
        canEdit = !!$user && ($user.role === 'admin' || $user.role === 'mod')
    }
</script>

<template>
    {#await promise}
        <div class="flex items-center justify-center h-[80vh]">
            <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
    {:then _ }
        <div class="flex items-center">
            <button
                    class="btn w-20 capitalize"
                    class:btn-outline={!edit}
                    class:btn-info={edit}
                    on:click={() => (edit = !edit)}
                    disabled="{!canEdit}">
                Edit
            </button>
            <div class="flex flex-grow items-center justify-center">
                <h1 class="text-5xl text-amber-700 select-none">{doc.title}</h1>
            </div>
        </div>

        <div class="h-[80rem] flex-1 items-center justify-start">
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
    {/await}
</template>
