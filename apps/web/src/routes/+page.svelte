<script lang="ts">
    import {pb} from '$lib/pocketbase';
    import type {Document} from '$lib/types';
    import MenuItem from '$components/MenuItem.svelte';

    const documents = pb.collection('entry').getFullList<Document>({
        sort: '+title',
        fields: 'id,collectionId,updated,title,content,thumbnail,images'
    });

    //     TODO: Add some sort of class coloring
    //     For example maybe do Warlock: <instruction>
    //     Then in postprocess color that element by warlock color
    //     TODO: Implement images via modal in markdown
    //     TODO: Also implement embedded images (![])
</script>

<div>
    {#await documents}
        <div>Loading...</div>
    {:then documents}
        <div class="grid h-full w-full grid-cols-4">
            {#each documents as doc}
                <MenuItem {doc}/>
            {/each}
        </div>
    {/await}
</div>
