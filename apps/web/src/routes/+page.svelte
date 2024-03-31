<script lang="ts">
    import MenuItem from '$lib/components/MenuItem.svelte';
    import DocService from "$lib/pocketbase/models/documents.js";

    const documents = DocService.GetAll();
</script>

{#await documents}
    <div>Loading...</div>
{:then documents}
    <section>
        <ul class="my-8 flex flex-wrap justify-center gap-4">
            {#each documents as doc}
                <MenuItem {doc}/>
            {/each}
        </ul>
    </section>
{/await}
