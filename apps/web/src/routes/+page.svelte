<script lang="ts">
    import PocketBase from 'pocketbase'
    import {POCKETBASE_URL} from "$lib/constants"
    import MenuItem from "$components/MenuItem.svelte";

    const pb = new PocketBase(POCKETBASE_URL)

    let docs: Document[] = []
    pb.collection('entry').getFullList({
        sort: '-title',
        fields: 'id,collectionId,updated,title,content,thumbnail,images'
    }).then((e: any) => {
        // e is of type Document[] but idk how to force it to be that
        docs = e
    })
</script>

<div>
    <div class="bg-base-300 w-full h-full grid grid-cols-2">
        {#each docs as doc}
            <MenuItem {doc}/>
        {/each}
    </div>
</div>
