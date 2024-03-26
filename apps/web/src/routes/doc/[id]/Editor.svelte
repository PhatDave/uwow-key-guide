<script lang="ts">
  import 'carta-md/default.css'; /* Default theme */
  import '@cartamd/plugin-attachment/default.css';
  import { CartaEditor, Carta } from 'carta-md';
  import { attachment } from '@cartamd/plugin-attachment';

  import { saveImg } from '$lib/pocketbase/models/images';
  import { pbImgToUrl } from '$lib/pocketbase/index.js';

  // The content of the editor
  export let content: string;
  export let documentId: string;

  const carta = new Carta({
    // Remember to use a sanitizer to prevent XSS attacks!
    // More on that below
    // sanitizer: ...
    extensions: [
      attachment({
        upload: async file => {
          console.log(file);
          const record = await saveImg(file, documentId);
          const imgUrl = pbImgToUrl(record, record.image);
          return imgUrl;
        }
      })
    ]
  });
</script>

<CartaEditor {carta} bind:value={content} />

<style>
  /* Set your custom monospace font */
  :global(.carta-font-code) {
    font-family: '...', monospace;
  }
  :global(.carta-editor) {
    @apply bg-base-100;
  }
</style>
