<script lang="ts">
    import {POCKETBASE_URL} from "$lib/Constants";
    import type {Document} from "$types";
    import {goto} from '$app/navigation';

    export let doc: Document

    const IMAGE_URL = `${POCKETBASE_URL}/api/files/${doc.collectionId}/${doc.id}/${doc.thumbnail}`
    console.log(IMAGE_URL);
</script>

<template>
    <!--    <div class="card w-[{MENU_THUMBNAIL_SIZE[0]}px] h-[{MENU_THUMBNAIL_SIZE[1]}px] bg-base-100 shadow-xl image-full">-->
    <div class="card lg:card-side shadow-xl py-4 px-10 cursor-pointer"
         on:click={goto("doc/" + doc.id)}>
        <figure><img class="w-[344px] h-[180px]" src="{IMAGE_URL}" alt="{doc.title}"/></figure>
        <div class="card-body">
            <h2 class="card-title">{doc.title}</h2>
        </div>
    </div>
</template>
