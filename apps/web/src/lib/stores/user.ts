import {writable} from 'svelte/store';
import {redirect} from '@sveltejs/kit';
import {pb} from '$lib/pocketbase';

export type User = {
    username: string;
    avatarUrl: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    discordId: string;
    isAdmin: boolean;
};

function createUserStore() {
    const {subscribe, set, update} = writable<User | null>(null);

    return {
        subscribe,
        update,
        set,

        logout: () => {
            // This call will automatically set user to null so no worries
            // Because the user store is a svelte store mimicking the authStore
            pb.authStore.clear();
            // Well if the user logs out, the store is null
            set(null);
        },
        login: {
            discord: async () => {
                try {
                    const authData = await pb.collection('users').authWithOAuth2({
                        provider: 'discord',
                        scopes: ['identify', 'guilds']
                    });

                    console.log(authData);
                    if (!authData.meta) {
                        pb.authStore.clear();
                        throw new Error('Discord oAuth2 failed');
                    }

                    await pb.collection('users').update(authData.record.id, {
                        accessToken: authData.meta.accessToken,
                        avatarUrl: authData.meta.avatarUrl,
                        refreshToken: authData.meta.refreshToken,
                        discordId: authData.meta.id
                    });
                } catch (error) {
                    console.error(error);
                }
                // This is because the user is normally on '/login' i redirect to '/r'
                // otherwise you could do a cool trick where you use url params
                // for example '/login?redirect=addons'
                // And once the login steps are complete, you read the current url's query params
                // and redirect the user there
                // And that is it...
                redirect(303, '/');
            }
        }
    };
}

export const user = createUserStore();
