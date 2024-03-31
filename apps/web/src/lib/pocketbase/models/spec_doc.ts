import {pb, type PBRecord} from '$lib/pocketbase';

export type SpecDoc = {
    content: string,
    doc: string,
    spec: string,
};

const SpecDocService = {
    async GetForDocId(id: string): Promise<PBRecord<SpecDoc>[]> {
        return await pb.collection("spec_doc").getFullList<PBRecord<SpecDoc>>({
            filter: `doc='${id}'`
        });
    },
}

export default SpecDocService;
