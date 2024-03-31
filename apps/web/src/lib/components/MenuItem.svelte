<script lang="ts">
    import type {PBRecord} from '$lib/pocketbase';
    import {PBImgToUrl} from '$lib/pocketbase';

    export let doc: Awaited<PBRecord<Document>>[number];

    const imgUrl = PBImgToUrl(doc, doc.thumbnail);
</script>

<li class="rounded-box">
    <a class="contents" href={`/doc/${doc.id}`}>
        <img alt={doc.title} class="aspect-video h-24 md:h-52" src={imgUrl}/>
    </a>
</li>
