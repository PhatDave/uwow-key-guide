<script lang="ts">
    import {marked} from 'marked'
    import PocketBase from 'pocketbase'

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
        console.log('PING')
        pb.collection('entry').update("ep0p3wx9pi4zes2", {content})
        clearTimeout(timer)
    }

    function textChanged() {
        clearTimeout(timer)
        timer = setTimeout(() => {
            updateApi(md)
        }, 200)
    }
</script>

<template>
    <button class="w-20 btn capitalize"
            class:btn-outline={!edit}
            class:btn-info={edit}
            on:click={() => (edit = !edit)}>
        Edit
    </button>
    <div class="form-control flex-1 items-center justify-start h-[80vh]">
        {#if edit}
        <textarea
                class="textarea min-h-[80vh] w-full"
                bind:value={md}
                on:keyup={textChanged}/>
        {:else}
            <div class="preview p-3 h-full w-full">{@html marked(md)}</div>
        {/if}
    </div>
</template>
