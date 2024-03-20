<script lang="ts">
    import type {Document} from "$lib/types";
    import {goto} from '$app/navigation';
    import {PocketbaseImageToUrl} from "$lib/pocketbase";

    export let doc: Document

    const IMAGE_URL = PocketbaseImageToUrl(doc, doc.thumbnail)
</script>

<template>
    <!--    <div class="card w-[{MENU_THUMBNAIL_SIZE[0]}px] h-[{MENU_THUMBNAIL_SIZE[1]}px] bg-base-100 shadow-xl image-full">-->
    <div class="card lg:card-side shadow-xl py-4 px-4 cursor-pointer"
         on:click={goto("doc/" + doc.id)}>
        <img class="w-[20rem] h-[10rem]" src="{IMAGE_URL}" alt="{doc.title}"/>
        <!--        <div class="card-body">-->
        <!--            <h2 class="card-title">{doc.title}</h2>-->
        <!--        </div>-->
    </div>
</template>
