<script lang="ts">
  import { pbImgToUrl, getDocuments } from '$lib/pocketbase';

  export let doc: Awaited<ReturnType<typeof getDocuments>>[number];

  const imgUrl = pbImgToUrl(doc, doc.thumbnail);
</script>

<li class="rounded-box">
  <a class="contents" href={`/doc/${doc.id}`}>
    <img class="aspect-video h-24 md:h-52" src={imgUrl} alt={doc.title} />
  </a>
</li>
