import type {PageLoad} from './$types';
import DocService from "../../../lib/pocketbase/models/documents";

export const load = (async ({params}) => {
    const {id} = params;
    const doc = await DocService.GetById(id);

    return {id, content: doc.content};
}) satisfies PageLoad;
