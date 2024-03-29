<script lang="ts">
    import Editor from './Editor.svelte';
    import Preview from './Preview.svelte';
    import {faEye, faPen} from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    import {user} from '$lib/stores/user';
    import {pb} from "$lib/pocketbase";

    Fa;

    export let data;

    const {id} = data;
    let mode: 'edit' | 'preview' = 'preview';
    let content = data.content;
    let userIsAdmin = false
    $: userIsAdmin = !!$user && $user.isAdmin;

    function toggleMode() {
        if (!$user || $user.isAdmin == false) {
            mode = 'preview';
            return;
        }
        mode = mode === 'edit' ? 'preview' : 'edit';
    }

    function contentUpdated(e) {
        if (e.detail.content != content) {
            content = e.detail.content;
            updateApi(content);
        }
    }

    function updateApi(content: string) {
        pb.collection('document').update(id, {content});
    }
</script>

<section class="form-control flex-1 justify-center">
    {#if mode === 'preview'}
        <Preview {content}/>
    {:else if mode === 'edit'}
        <Editor {content} documentId={id} on:update={contentUpdated}/>
    {/if}
</section>

{#if userIsAdmin}
    <button class="sticky bottom-[5%] left-[95%] inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black"
            on:click={toggleMode}>
        {#if mode === 'preview'}
            <Fa icon={faPen} size="1.3x"/>
        {:else if mode === 'edit'}
            <Fa icon={faEye} size="1.3x"/>
        {/if}
    </button>
{/if}
