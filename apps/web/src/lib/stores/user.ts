import {writable} from 'svelte/store';
import {redirect} from '@sveltejs/kit';
import {pb} from '$lib/pocketbase';
import type {RecordModel} from 'pocketbase';

export type User = {
    username: string;
    avatarUrl: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    discordId: string;
}

function createUserStore() {
    const {subscribe, set, update} = writable<User | null>(null);

    return {
        subscribe,
        update,
        set,

        logout: () => {
            // This here clears the auth store, and hooks.client.ts reacts and clears the cookie
            pb.authStore.clear();
            // We set the store to null, and svelte-ui immediately reacts to this
            // But it might be a good idea to invalidate the whole page
            //
            // Well if the user logs out, the store is null
            set(null);
        },
        login: {
            discord: async () => {
                try {
                    // It's in trycatch, because this authetication throws if user clicks on cancel
                    // If successful, this creates a new user
                    const authData = await pb.collection('users').authWithOAuth2({
                        provider: 'discord',
                        // The scopes are things that are provided by discord
                        // For example, when you query a url, you might make it only request the user's email address, you could also ask for what guilds (servers) he is in.
                        // Look at the url generator now, for an example
                        scopes: ['identify', 'guilds']
                        // To check if a user is in the indecisive discord
                    });

                    // So now if it's not successful, i throw here
                    if (!authData.meta) throw new Error('Discord oAuth2 failed');

                    // Otherwise , i update the new pb user with the following
                    // Yes
                    const user = await pb
                        .collection('users')
                        .update<User & RecordModel>(authData.record.id, {
                            accessToken: authData.meta.accessToken,
                            avatarUrl: authData.meta.avatarUrl,
                            refreshToken: authData.meta.refreshToken,
                            discordId: authData.meta.id
                        } as Omit<User, 'email' | 'username'>);

                    // And then i just update the svelte store with the user's data
                    //
                    // This is the svelte store
                    // We set it after the user logs in
                    // It is the store itself
                    set({
                        accessToken: user.accessToken,
                        avatarUrl: user.avatarUrl,
                        email: user.email,
                        refreshToken: user.refreshToken,
                        username: user.username,
                        discordId: user.discordId
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
