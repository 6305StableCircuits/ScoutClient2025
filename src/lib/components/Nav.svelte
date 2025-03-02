<script lang="ts">
    import { uppercase, pathEntries, isCurrentPath } from '$lib';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import Button from '$lib/components/Button.svelte';
    import NavMenu from '$lib/components/NavMenu.svelte';
    import Link from '$lib/components/Link.svelte';
    let portrait = $state<HTMLSpanElement>();
    let landscape = $state<HTMLSpanElement>();
    import settingsIcon from '$lib/assets/settings.svg';
    console.log(settingsIcon);
    //     type $state<T> = T;
    // onMount(()=>{
    //     let landScapeStyle = getComputedStyle(landscape!);
    //     if(landScapeStyle.display === "none"){
    //         landscape!.remove();
    //     }else{
    //         portrait!.remove();
    //     }
    // })
</script>

<main
    class="justify-between flex max-h-16 px-10 content-center mx-[-1em] text-center px-10 m-auto bg-gray-800 w-[100.475vw]"
>
    <h1 class="text-[2em] pt-2">ScoutClient 2025</h1>
    <span
        class="landscape flex justify-between content-center text-center px-10 w-[75vw]"
        bind:this={landscape}
    >
        {#key $page}
            {#each pathEntries as [title, path]}
                <span class="text-lg pt-4 pb-0">
                    {#if isCurrentPath(path)}
                        <span class="cursor-not-allowed text-white">{uppercase(title ?? '')}</span>
                    {:else}
                        <Link url={path} class="text-white">{uppercase(title ?? '')}</Link>
                    {/if}&nbsp;
                </span>
            {/each}
            &nbsp;<Link class="pt-4 pb-0" url="settings"
                ><img src={settingsIcon} alt="settings" width="24px" /></Link
            >
        {/key}
    </span>
    <span class="portrait" bind:this={portrait}>
        <div class="float-right flex absolute right-[5%] pt-3 pointer z-50">
            <Link url="settings" class="float-left pt-1 pb-0"
                ><img src={settingsIcon} alt="settings" width="24px" /></Link
            >&nbsp;
            <NavMenu />
        </div>
    </span>
</main>

<style>
    @media screen and (orientation: portrait) {
        .landscape {
            display: none;
        }
    }
    @media screen and (orientation: landscape) {
        .portrait {
            display: none;
        }
    }
</style>
