<script lang="ts">
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { faDiscord } from '@fortawesome/free-brands-svg-icons';
  import Fa from 'svelte-fa';

  import { user } from '$lib/stores/user';

  Fa;
</script>

<div
  class="flex h-16 select-none items-center justify-between border-b-[1px] border-b-black/25 px-4 dark:border-b-white/25 md:px-8"
>
  <!-- Navigation-->
  <nav>
    <a class="hover:text-primary text-4xl font-bold transition-all" href="/">
      Home
    </a>
  </nav>

  <div class="flex items-center gap-x-4">
    <ThemeToggle />
    {#if !$user}
      <button
        class="btn rounded-box bg-transparent outline outline-1"
        on:click={user.login.discord}
      >
        Sign In
        <Fa icon={faDiscord} size="1.3x" />
      </button>
    {:else}
      <button class="px-4 text-lg font-extrabold" on:click={user.logout}>
        {$user.username}
      </button>
      <img src={$user.avatarUrl} alt="user avatar" class="h-10 rounded-full" />
    {/if}
  </div>
</div>
