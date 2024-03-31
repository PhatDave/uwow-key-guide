import {pb, type PBRecord} from '$lib/pocketbase';

export type Document = {
    title: string;
    content: string;
    thumbnail: string;
};

const DocService = {
    GetAll: async () => {
        return pb.collection('document').getFullList<PBRecord<Document>>({
            sort: '+title',
            fields: 'id,collectionId,updated,title,content,thumbnail,images'
        });
    },
    GetById(id: string) {
        return pb.collection('document').getOne<PBRecord<Document>>(id);
    },
    Update: async (id: string, content: string) => {
        return pb.collection('document').update<PBRecord<Document>>(id, {content});
    }
}

export default DocService;
