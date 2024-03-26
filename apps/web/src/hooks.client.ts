import {pb} from '$lib/pocketbase';
import {user, type User} from '$lib/stores/user';
import type {RecordModel} from 'pocketbase';

pb.authStore.loadFromCookie(document.cookie);

pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        secure: false
    });

    user.set(pb.authStore.isValid ? (pb.authStore.model as User & RecordModel) : null);
});

if (pb.authStore.isValid) pb.collection('users').authRefresh();
