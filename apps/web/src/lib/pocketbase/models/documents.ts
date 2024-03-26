import type {PBRecord} from '$lib/pocketbase';
import {pb} from '$lib/pocketbase';

export type Document = {
    title: string;
    content: string;
    thimbnail: string;
};

export async function getDocuments() {
    const documents = pb.collection('document').getFullList<PBRecord<Document>>({
        sort: '+title',
        fields: 'id,collectionId,updated,title,content,thumbnail,images'
    });
    return documents;
}

export async function getDocumentContent(id: string) {
    const document = await pb.collection('document').getOne<PBRecord<Document>>(id);
    return document.content;
}
