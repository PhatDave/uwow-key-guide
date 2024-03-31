<script lang="ts">
    import '../app.postcss';
    import {env} from '$env/dynamic/public';
    import Nav from '$lib/components/Nav.svelte';
</script>

<svelte:head>
    <meta content="SvelteKit Template" name="description"/>

    <meta content="SvelteKit Template" itemprop="name"/>
    <meta content="SvelteKit Template" itemprop="description"/>
    <meta content={`${env.PUBLIC_ORIGIN_URL}/logo.png`} itemprop="image"/>

    <meta content={env.PUBLIC_ORIGIN_URL} property="og:url"/>
    <meta content="Website" property="og:type"/>
    <meta content="SvelteKit Template" property="og:title"/>
    <meta content="SvelteKit Template" property="og:description"/>
    <meta content={`${env.PUBLIC_ORIGIN_URL}/logo.png`} property="og:image"/>

    <meta content={`${env.PUBLIC_ORIGIN_URL}/logo.png`} name="twitter:card"/>
    <meta content="Indecisive" name="twitter:title"/>
    <meta content="SvelteKit Template" name="twitter:description"/>
    <meta content={`${env.PUBLIC_ORIGIN_URL}/logo.png`} name="twitter:image"/>
</svelte:head>

<div class="form-control min-h-screen">
    <Nav/>
    <main class="form-control container relative flex-1 mx-auto">
        <slot/>
    </main>
</div>
