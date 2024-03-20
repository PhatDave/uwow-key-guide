<script lang="ts">
    import PocketBase from 'pocketbase'
    import {POCKETBASE_URL} from "$lib/constants"
    import MenuItem from "$components/MenuItem.svelte";

    const pb = new PocketBase(POCKETBASE_URL)

    let docs: Document[] = []
    pb.collection('entry').getFullList({
        sort: '+title',
        fields: 'id,collectionId,updated,title,content,thumbnail,images'
    }).then((e: any) => {
        // e is of type Document[] but idk how to force it to be that
        docs = e
    })
//     TODO: Add some sort of class coloring
//     For example maybe do Warlock: <instruction>
//     Then in postprocess color that element by warlock color
//     TODO: Add auth of some form
//     TODO: Implement images via modal in markdown
//     TODO: Also implement embedded images (![])
</script>

<div>
    <div class="w-full h-full grid grid-cols-4">
        {#each docs as doc}
            <MenuItem {doc}/>
        {/each}
    </div>
</div>
