<script lang="ts">
	import '$styles';
	import { env } from '$env/dynamic/public';

	import { theme } from '$lib/stores/theme';
	import BaseHeader from '$lib/components/headers/BaseHeader.svelte';
	import { browser } from '$app/environment';
	import { onMount, setContext } from 'svelte';

	onMount(() => {
		if (browser) theme.init();
	});
	$: {
		if (browser && $theme) {
			document.documentElement.setAttribute('data-theme', $theme);
			document.documentElement.classList.value = $theme;
		}
	}
	// setContext("user", user)
	// I honest do not remember the exact reason i use it
	// You can try removing it and see if it works

	// How would your components react to changes ?
	// If the user logs out, your UI needs to react, correct?
	// you need to 'invalidate'  - redirect  does not re-load
	// 1: clear the pb.AuthStore.
	// 2: Invalidate the route, so all UI re-renders and state is put in the correct way
	// Because, you could have a check in some component that checks if a user is loged in,
	// to show him so ui to perform some action, but then he logs out - the js logic to remove that UI will not react unless
	// it depends on a svelte store - So what you do is to 'reinvalidate' the whole application, so all components re-run

	// If you want you can also look at the authRecord on the pb instance
	// The .model on the authStore will have your data - it's not typed, that is why i do not use it
	// pb.authStore.model
</script>

<svelte:head>
	<meta name="description" content="SvelteKit Template" />

	<meta itemprop="name" content="SvelteKit Template" />
	<meta itemprop="description" content="SvelteKit Template" />
	<meta itemprop="image" content={`${env.PUBLIC_ORIGIN_URL}/logo.png`} />

	<meta property="og:url" content={env.PUBLIC_ORIGIN_URL} />
	<meta property="og:type" content="Website" />
	<meta property="og:title" content="SvelteKit Template" />
	<meta property="og:description" content="SvelteKit Template" />
	<meta property="og:image" content={`${env.PUBLIC_ORIGIN_URL}/logo.png`} />

	<meta name="twitter:card" content={`${env.PUBLIC_ORIGIN_URL}/logo.png`} />
	<meta name="twitter:title" content="Indecisive" />
	<meta name="twitter:description" content="SvelteKit Template" />
	<meta name="twitter:image" content={`${env.PUBLIC_ORIGIN_URL}/logo.png`} />
</svelte:head>

<div
	class="form-control heropattern-topography-black/10 dark:heropattern-topography-white/10 min-h-screen bg-fixed">
	<BaseHeader />
	<main class="form-control flex-1">
		<slot />
	</main>
</div>
