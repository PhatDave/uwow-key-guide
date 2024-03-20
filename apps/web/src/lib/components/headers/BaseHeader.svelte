<script lang="ts">
    import ThemeToggle from '$components/theme/ThemeToggle.svelte';
    import {faXmark} from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    Fa;
</script>

<div class="flex h-20 items-center justify-between px-4">
    <nav>
        <ul class="flex gap-x-8 text-3xl font-bold [&_a:hover]:text-primary [&_a]:transition-colors">
            <li>
                <a href="/"> Home </a>
            </li>
        </ul>
    </nav>

    <div class="[&>*:hover]:text-primary flex items-center space-x-4 [&>*]:transition-all [&>*]:duration-300">
        <ThemeToggle/>
    </div>
</div>
