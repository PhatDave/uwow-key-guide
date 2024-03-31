<script lang="ts">
    import Fa from 'svelte-fa';
    import type {PBRecord} from "$lib/pocketbase";
    import SpecService, {type Spec} from "$lib/pocketbase/models/specs";
    import {createEventDispatcher} from "svelte";

    Fa;

    const dispatch = createEventDispatcher<PBRecord<Spec>>();

    let specs: PBRecord<Spec>[] = [];
    SpecService.GetAll().then((res) => {
        specs = res;
    });

    function select(spec: PBRecord<Spec>) {
        dispatch('select', spec);
    }
</script>

<template>
    <div role="tablist" class="tabs tabs-bordered py-3 mx-auto">
        {#each specs as s}
            <button role="tab" class="tab text-xl text-bold" style="color: {s.color}" on:click={() => select(s)}>{s.spec}</button>
        {/each}
    </div>
</template>
