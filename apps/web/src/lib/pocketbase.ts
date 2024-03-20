import PocketBase, {type RecordModel} from 'pocketbase'

const POCKETBASE_URL = 'https://uwowkeys.site.quack-lab.dev'

type ImageThumb = {
    x: number;
    y: number;
};

export function PocketbaseImageToUrl(record: RecordModel, image: string, thumb?: ImageThumb) {
    let url = `${POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${image}`;
    url += thumb ? `?${thumb.x}x${thumb.y}` : '';
    return url;
};

export const pb = new PocketBase(POCKETBASE_URL)
