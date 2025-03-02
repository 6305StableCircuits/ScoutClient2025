<script lang="ts">
    import { clickoutside } from '@svelte-put/clickoutside';
    import Link from '$lib/components/Link.svelte';
    import { page } from '$app/stores';
    import { slide, fade, fly } from 'svelte/transition';
    import { uppercase, pathEntries, isCurrentPath } from '$lib';
    let mobile = globalThis?.matchMedia?.('only screen and (max-width: 600px)')?.matches;
    import Button from '$lib/components/Button.svelte';
    let showing = $state(false);
    let button = $state<any>();
    // function isParent(node:Node,parent:Node):boolean{
    //     let parents = [];
    //     while(node !== null){
    //         parents.push(node as unknown as Node);
    //         node = node.parentNode as unknown as Node;
    //     }
    //     return parents.includes(parent as unknown as Node);
    // }
    // function onclick(e:Event){
    //     if(e.target !== button && !isParent(e.target as Node,button)){
    //         showing = false;
    //     }
    // }
    //document.addEventListener('click',onclick);
    let hidden = $state(true);
    $effect(() => {
        showing;
        setTimeout(() => {
            hidden = showing ? false : true;
        }, 400);
    });
</script>

<!--svelte-ignore a11y_no_noninteractive_element_interactions-->
<!--svelte-ignore a11y_click_events_have_key_events-->
<main class="top-0 text-center" use:clickoutside onclickoutside={() => (showing = false)}>
    <!-- {#if !showing} -->
    <Button onmouseup={() => (showing = !showing)} class="top-0 bg-gray-800">☰</Button>
    {#if !hidden}
        <div
            class="rounded pt-0 bg-gray-800 h-svh"
            in:slide={{ axis: 'x' }}
            out:fly={{ x: 100, duration: 1000 }}
        >
            <!--Can't quite decide between out:fly and out:slide-->
            {#key $page}
                {#each pathEntries as [title, path]}
                    {#if showing}
                        <p
                            class="text-lg px-5"
                            in:fade={{ duration: 250 }}
                            out:fade={{ duration: 250 }}
                        >
                            {#if isCurrentPath(path)}
                                <span class="cursor-not-allowed text-white"
                                    >{uppercase(title ?? '')}</span
                                >
                            {:else}
                                <Link
                                    url={path}
                                    class="text-white"
                                    onclick={() => {
                                        showing = false;
                                        hidden = true;
                                    }}>{uppercase(title ?? '')}</Link
                                >
                            {/if}
                        </p>
                    {/if}
                {/each}
            {/key}
        </div>
    {/if}
</main>

<style>
    /* .shadow{
        box-shadow: 0px 0px 5px black;
    } */
</style>
