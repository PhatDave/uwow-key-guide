import {getDocumentContent} from '$lib/pocketbase';
import type {PageLoad} from './$types';

export const load = (async ({params}) => {
    const {id} = params;
    const content = await getDocumentContent(id);

    return {id, content};
}) satisfies PageLoad;
