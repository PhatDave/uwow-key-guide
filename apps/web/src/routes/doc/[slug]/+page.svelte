<script lang="ts">
    import {marked} from 'marked'
    import {pb, PocketbaseImageToUrl} from '$lib/pocketbase'
    import {onDestroy, onMount} from "svelte"
    import type {Document, Image} from "$lib/types"
    import {user} from "$stores/user"
    import Fuse from 'fuse.js'

    export let data;
    const id = data.slug;
    let canEdit = false;
    let edit = false;
    let timer: NodeJS.Timeout;
    let files: File[] = [];
    let images: Image[] = [];
    let sortedImages: Image[] = [];
    $: sortedImages = images.slice(0, 10);
    let doc: Document;
    let fuse: Fuse<Image>;

    let loading = true;
    let textareaElement: HTMLElement;
    let imageInput: HTMLElement;
    let imageSearchQuery: string;
    let imageInputContainer: HTMLElement;

    pb.collection('entry').subscribe(id, function (e: any) {
        if (e.action === 'update') {
            doc = e.record
        }
    });

    onMount(async () => {
        doc = await pb.collection('entry').getOne(id, {fields: 'content,title', extend: 'images'})
        images = await pb.collection('image').getFullList({
            filter: `(entry='${id}')`,
            fields: 'image,collectionId,id',
        })
        fuse = new Fuse(images, {
            keys: ['image'],
            includeScore: true,
            includeMatches: true,
            isCaseSensitive: false,
            // threshold: 0.4
        })
        loading = false
    });

    onDestroy(() => {
        updateApi(doc)
        pb.collection('entry').unsubscribe()
    });

    function updateApi(doc: Document) {
        // For some reason when this is called from a user that is not authenticated it returns 404
        // It also throws an error from the sdk
        // Whatever, don't care, as long as it actually prevents non admins from using the api
        pb.collection('entry').update(id, {content: doc.content})
        clearTimeout(timer)
    }

    const ImageInput = {
        show: () => {
            imageInputContainer.classList.remove('hidden')
            imageInput.focus()
        },
        hide: () => {
            imageInputContainer.classList.add('hidden')
            textareaElement.focus()
        }
    }

    function textChanged(event: Event) {
        if (event.key == '(') {
            ImageInput.show()
        }
        if (event.key == "Escape") {
            ImageInput.hide()
        }
        // Tab is caught by the browser... Sadge...
        // if (event.key == "Tab") {
        //     event.preventDefault()
        //     const selectionStart = textareaElement.selectionStart;
        //     const selectionEnd = textareaElement.selectionEnd;
        //     const textBefore = doc.content.slice(0, selectionStart - 1);
        //     const textAfter = doc.content.slice(selectionEnd);
        //     doc.content = `${textBefore}    ${textAfter}`;
        // }
        clearTimeout(timer);
        timer = setTimeout(() => {
            updateApi(doc);
        }, 4000);
    }

    function imageInputEvent(event: Event) {
        console.log(event);
        if (event.key == "Escape") {
            ImageInput.hide()
            textareaElement.focus();
        }
        if (!imageSearchQuery) {
            sortedImages = images.slice(0, 10)
            return
        }
        const result = fuse.search(imageSearchQuery);
        sortedImages = result.map((e: any) => e.item)
    }

    function selectImage(event: Event) {
        if (!event.target) {
            return
        }
        const selectedImageName = event.target.innerText;
        const selectedImage = images.find((e) => e.image === selectedImageName);
        const imageLink = PocketbaseImageToUrl(selectedImage, selectedImage.image);

        const selectionStart = textareaElement.selectionStart;
        const selectionEnd = textareaElement.selectionEnd;
        const textBefore = doc.content.slice(0, selectionStart - 1);
        const textAfter = doc.content.slice(selectionEnd);

        doc.content = `${textBefore}(${imageLink})${textAfter}`;
        ImageInput.hide()
    }

    function render(markdown: string) {
        // @ts-ignore
        let html: string = marked(markdown);
        html = html.replaceAll(/<ul>/g, '<ul class="list-disc pl-5">');
        html = html.replaceAll(/<ol>/g, '<ol class="list-decimal pl-5">');
        html = html.replaceAll(/<strong>/g, '<strong class="font-bold text-sky-400">');
        html = html.replaceAll(/<em>/g, '<em class="italic text-sky-400">');
        html = html.replaceAll(/<code>/g, '<code class="bg-gray-200 text-gray-800 px-1 rounded">');
        html = html.replaceAll(/<pre>/g, '<pre class="bg-gray-200 text-gray-800 px-1 rounded">');
        html = html.replaceAll(/<h1>/g, '<h1 class="text-4xl font-bold text-amber-700">');
        html = html.replaceAll(/<h2>/g, '<h2 class="text-3xl font-bold text-amber-700">');
        html = html.replaceAll(/<h3>/g, '<h3 class="text-2xl font-bold text-amber-700">');
        html = html.replaceAll(/<a>/g, '<a class="text-sky-400">');

        const imageRegex = /<img src="([^"]+?)"(?:\s*alt="([^"]+)?")?>{(\d+),\s*(\d+)}/g
        let match;
        do {
            match = imageRegex.exec(html);
            if (match) {
                const [element, url, alt, width, height] = match
                html = html.replace(element, `<img src="${url}" alt="${alt}" width="${width}" height="${height}" />`);
            }
        } while (match);

        // const modalImage = /\?<a.+?href="([^"]+)">([^<]+)<\/a>/g.exec(html)
        // if (modalImage) {
        //     const [url, text] = modalImage.slice(1)
        //     html = html.replace(modalImage[0], `<ModalImage link="${url}" />`);
        // // Cannot dynamically create svelte components so easily...
        //     console.log(html);
        // }

        return html
    }

    $: {
        canEdit = !!$user && ($user.role === 'admin' || $user.role === 'mod')
    }

    $: {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                console.log(files[i]);
                const formData = new FormData()
                formData.append('image', files[i])
                formData.append('entry', id)
                pb.collection('image').create(formData).then((e: any) => {
                    //     TODO: Add some sort of feedback here
                    //     Maybe make the button glow red/green, would be nice
                    images.push(e.id)
                    fuse.add(e)
                })
            }
            files = []
        }
    }

    //     TODO: Do intellisense style popup when creating links to images
    //     Try use that search library what was it named...
    //     Or maybe try fuse, it seems to be much more popular...
</script>

<template>
    <div class="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-50 hidden" bind:this={imageInputContainer}>
        <input type="text" placeholder="Type here" class="input input-bordered w-[35rem]"
               bind:this={imageInput}
               bind:value={imageSearchQuery}
               on:keyup={imageInputEvent}/>
        <ul class="menu bg-base-200 rounded-box w-[35rem]" on:click={selectImage}>
            {#each sortedImages as image}
                <li><a>{image.image}</a></li>
            {/each}
        </ul>
    </div>
    {#if loading}
        <div class="flex items-center justify-center h-[80vh]">
            <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
    {:else }
        <div class="flex items-center">
            <button
                    class="btn w-20 capitalize"
                    class:btn-outline={!edit}
                    class:btn-info={edit}
                    on:click={() => (edit = !edit)}
                    disabled="{!canEdit}">
                Edit
            </button>
            {#if edit}
                <div class="flex flex-grow items-center justify-center">
                    <input accept="image/png, image/jpg" multiple
                           type="file"
                           bind:files
                           disabled={!canEdit}
                           class="file-input w-full max-w-xs"/>
                </div>
            {:else}
                <div class="flex flex-grow items-center justify-center">
                    <h1 class="text-5xl text-amber-700 select-none">{doc.title}</h1>
                </div>
            {/if}
        </div>

        <div class="h-[80rem] flex-1 items-center justify-start">
            {#if edit}
                <textarea class="textarea min-h-[80vh] w-full"
                          bind:value={doc.content}
                          bind:this={textareaElement}
                          on:keyup={textChanged}/>
            {:else}
                <div class="h-full w-full px-10 py-4 text-xl">
                    {@html render(doc.content)}
                </div>
            {/if}
        </div>
    {/if}
</template>
