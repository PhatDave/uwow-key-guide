<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { Image, Entry, PBRecord } from '$lib/types';
	// We should move types to $lib i think
	import MenuItem from '$components/MenuItem.svelte';

	// Look at how you should do it
	type Document = PBRecord<Entry, Image>;
	const documents = pb.collection('entry').getFullList<Document>({
		sort: '+title',
		fields: 'id,collectionId,updated,title,content,thumbnail,images'
	});
	// This should be it ^^ look how simple it is

	// But you remmeber that we cannot await a promise in the script block, you would need the onMount scope
	// Usually you should do it in the html with the special {#await ... then ... catch ...} syntax
	// That is only the case if you do not need to transform the data, if you do you should use the onMount scope

	// let docs:PBRecord<Entry, Image>[] =[]
	// let docs:PBRecord<Entry, PBRecord<Image, Entry>>[] = []
	// You omit the second generic if you do not

	// If you need to expand multiple times, you do this
	// You should do this here

	onMount(async () => {
		// Here
	});

	//     TODO: Add some sort of class coloring
	//     For example maybe do Warlock: <instruction>
	//     Then in postprocess color that element by warlock color
	//     TODO: Add auth of some form
	//     TODO: Implement images via modal in markdown
	//     TODO: Also implement embedded images (![])
</script>

<div>
	<div class="grid h-full w-full grid-cols-4">
		{#each docs as doc}
			<MenuItem {doc} />
		{/each}
	</div>
</div>
