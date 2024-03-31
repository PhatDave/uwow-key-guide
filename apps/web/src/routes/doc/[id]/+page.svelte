<script lang="ts">
    import Editor from './Editor.svelte';
    import Preview from './Preview.svelte';
    import {faEye, faPen} from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    import {user} from '$lib/stores/user';
    import {onDestroy, onMount} from "svelte";
    import DocService from "$lib/pocketbase/models/documents";
    import SpecService from "$lib/pocketbase/models/specs";

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
        updateApi(content);
    }

    function contentUpdated(e) {
        if (e.detail.content != content) {
            content = e.detail.content;
            updateApi(content);
        }
    }

    function updateApi(content: string) {
        DocService.Update(id, content);
    }

    function toggleModeListener(e) {
        if (e.ctrlKey && e.key == 'y') {
            e.preventDefault();
            toggleMode();
        }
    }

    let specs = [];
    SpecService.GetAll().then((res) => {
        specs = res;
        console.log(res);
    });

    onMount(() => {
        document.addEventListener('keyup', toggleModeListener);
    });
    onDestroy(() => {
        document.removeEventListener('keyup', toggleModeListener);
    });

    //     TODO: Enable ctrl+s to save as markdown
    //     TODO: Enable live update
    //     To do this we need a separate API
    //     What the API will do is:
    //     Take in new content
    //     Try to merge the new content with the existing content
    //     If the merge is successful, update the content
    //     If the merge is unsuccessful, replace the old content with the new content
    //     (The idea being last edit wins)
    //     TODO: Implement class specific info
    //     Either have a separate doc for each spec for each instance (bad)
    //     Or have 2 separate previews for each instance
    //     Where preview #1 is the current one - general instance info
    //     And preview #2 is the spec specific info
    //     Where you could then opt in or out of specific specs to display their specific info
    //     In pane #2
    //     In DB do maybe spec-instance
    //     With content (markdown) and relation (document)
    //     On edit maybe have a dropdown to select spec
    //     Have user choice be remembered
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
