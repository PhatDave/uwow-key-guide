import { pb, type PBRecord } from '$lib/pocketbase';

type Image = {
  image: string;
  document: string;
};

export async function saveImg(image: File, documentId: string) {
  const img = await pb.collection('image').create<PBRecord<Image>>({ image, document: documentId });

  return img;
}
