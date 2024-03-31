import {pb, type PBRecord} from '$lib/pocketbase';

type Image = {
    image: string;
    document: string;
};

const ImageService = {
    async Save(image: File, documentId: string): Promise<PBRecord<Image>> {
        return await pb.collection('image').create<PBRecord<Image>>({image, document: documentId});
    },
}

export default ImageService;
