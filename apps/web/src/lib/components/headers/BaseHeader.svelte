<script lang="ts">
    import ThemeToggle from '$components/theme/ThemeToggle.svelte';
    import {faDiscord} from '@fortawesome/free-brands-svg-icons';
    import Fa from 'svelte-fa';

    import {user} from '$lib/stores/user';

    Fa;
</script>

<div class="flex h-20 items-center justify-between px-4">
    <nav>
        <ul class="[&_a:hover]:text-primary flex gap-x-8 text-3xl font-bold [&_a]:transition-colors">
            <li>
                <a href="/"> Home </a>
            </li>
        </ul>
    </nav>

    <div></div>
    <div class="flex">
        <div class="[&>*:hover]:text-primary flex items-center px-106 space-x-4 [&>*]:transition-all [&>*]:duration-300">
            <ThemeToggle/>
        </div>
        <div class="min-w-[15vw] max-w-[15vw] flex justify-center items-center">
            {#if !$user}
                <button class="text-primary inline-flex items-center gap-x-2 font-bold"
                        on:click={user.login.discord}>
                    Sign In
                    <Fa icon={faDiscord} size="1.3x" class="text-white"/>
                </button>
            {:else}
                <span class="text-lg font-extrabold px-4" on:click={user.logout}>
                    {$user.username}
                </span>
                <img src={$user.avatarUrl} class="h-10 rounded-full"/>
            {/if}
        </div>
    </div>
</div>
