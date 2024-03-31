import type {RecordModel} from 'pocketbase';
import {POCKETBASE_URL} from '$lib/pocketbase';

type ImageThumb = {
    x: number;
    y: number;
};

export function PBImgToUrl(record: RecordModel, image: string, thumb?: ImageThumb) {
    let url = `${POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${image}`;
    url += thumb ? `?${thumb.x}x${thumb.y}` : '';
    return url;
}

export type PBRecord<T, E = unknown> = RecordModel &
    T &
    (E extends Record<string, unknown>
        ? { expand: { [Key in keyof E]: E[Key] } & RecordModel }
        : unknown);
