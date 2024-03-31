import {pb, type PBRecord} from '$lib/pocketbase';

export type Spec = {
    spec: string;
    color: string;
};

const SpecService = {
    async GetAll(): Promise<PBRecord<Spec>[]> {
        return await pb.collection('spec').getFullList<PBRecord<Spec>>({
            sort: '+spec',
            fields: 'id,spec,color'
        });
    },
}

export default SpecService;
