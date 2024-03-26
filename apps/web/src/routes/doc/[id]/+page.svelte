<script lang="ts">
  //This here is the styles used by github

  import Editor from './Editor.svelte';
  import Preview from './Preview.svelte';
  import { faPen, faEye } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  export let data;
  const { id } = data;

  let mode: 'edit' | 'preview' = 'preview';
  let content = data.content;

  function toggleMode() {
    mode = mode === 'edit' ? 'preview' : 'edit';
  }
</script>

<section class="form-control flex-1 justify-center">
  {#if mode === 'preview'}
    <Preview {content} />
  {:else if mode === 'edit'}
    <Editor {content} documentId={id} />
  {/if}
</section>

<button
  class="sticky bottom-[5%] left-[95%] inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black"
  on:click={toggleMode}
>
  {#if mode === 'preview'}
    <Fa icon={faPen} size="1.3x" />
  {:else if mode === 'edit'}
    <Fa icon={faEye} size="1.3x" />
  {/if}
</button>
