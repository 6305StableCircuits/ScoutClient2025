<script lang="ts">
    import {uppercase,pathEntries,isCurrentPath} from '$lib';
    import {page} from '$app/stores';
    let mobile = globalThis?.matchMedia?.("only screen and (max-width: 600px)")?.matches;
    import Button from '$lib/components/Button.svelte';
    import NavMenu from '$lib/components/NavMenu.svelte';
    import Link from '$lib/components/Link.svelte';
</script>
<main class="justify-between flex max-h-16 px-10 content-center mx-[-1em] text-center px-10 m-auto bg-gray-800 w-[100.475vw] mt-0">
    <h1 class="text-[2em] pt-2">ScoutClient 2025</h1>
    {#if !mobile}
        {#key $page}
            {#each pathEntries as [title,path]}
                <span class="text-lg pt-4 pb-0">
                    {#if isCurrentPath(path)}
                        <span class="cursor-not-allowed text-white">{uppercase(title??'')}</span>
                    {:else}
                        <Link url={path} class="text-white">{uppercase(title??'')}</Link>
                    {/if}&nbsp;
                </span>
            {/each}
        {/key}
    {:else}
        <div class="float-right absolute right-[5%] pt-3 pointer z-50">
        <NavMenu />
        </div>
    {/if}
</main>