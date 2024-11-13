<script lang="ts">
    let pathname = globalThis?.location?.pathname?.slice?.(1);
    import {paths,uppercase} from '$lib';
    let mobile = globalThis?.matchMedia?.("only screen and (max-width: 600px)")?.matches;
    import Button from '$lib/components/Button.svelte';
    let showing = $state(false);
    import NavMenu from '$lib/components/NavMenu.svelte';
</script>
<main>
<main class="justify-between flex max-w-6xl mx-auto px-4 justify-center text-center m-auto bg-gray-800 w-full">
    <h1 class="text-lg">ScoutClient 2025</h1>
    {#if !mobile}
    {#each paths as path}
    <span class="text-lg">
        {#if path !== pathname}
        <a href={path}>{uppercase(path)}</a>
        {:else}
        {uppercase(path)}
        {/if}&nbsp;
    </span>
    {/each}
    {/if}
</main>
    {#if mobile}
    <div class="float-right z-index-100 absolute top-[2%] right-[5%]">
    <NavMenu />
    </div>
    {/if}
</main>