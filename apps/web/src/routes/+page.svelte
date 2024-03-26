<script lang="ts">
  import { getDocuments } from '$lib/pocketbase';
  import MenuItem from '$lib/components/MenuItem.svelte';

  const documents = getDocuments();
</script>

{#await documents}
  <div>Loading...</div>
{:then documents}
  <section>
    <ul class="my-8 flex flex-wrap justify-center gap-4">
      {#each documents as doc}
        <MenuItem {doc} />
      {/each}
    </ul>
  </section>
{/await}
