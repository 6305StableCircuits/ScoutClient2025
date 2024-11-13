<script lang="ts">
    import {slide,fade} from 'svelte/transition';
    let pathname = globalThis?.location?.pathname?.slice?.(1);
    import {paths,uppercase} from '$lib';
    let mobile = globalThis?.matchMedia?.("only screen and (max-width: 600px)")?.matches;
    import Button from '$lib/components/Button.svelte';
    let showing = $state(false);
    let button = $state<any>();
    function isParent(node:Node,parent:Node):boolean{
        let parents = [];
        while(node !== null){
            parents.push(node as unknown as Node);
            node = node.parentNode as unknown as Node;
        }
        return parents.includes(parent as unknown as Node);
    }
    function onclick(e:Event){
        console.log(e.target);
        console.log(button);
        if(e.target !== button && !isParent(e.target as Node,button)){
            showing = false;
        }
    }
    document.addEventListener('click',onclick);
    let shows = $state([true,false]);
</script>
<style>
    .shadow{
        box-shadow: 0px 0px 5px black;
    }
</style>
<!--svelte-ignore a11y_no_noninteractive_element_interactions-->
<!--svelte-ignore a11y_click_events_have_key_events-->
<main onclick={onclick} bind:this={button} class="text-center" class:shadow={showing}>{#if showing}<br>{/if}
{#if shows[0] && !showing}
<span in:fade={{duration:100,delay:50}} out:fade={{duration:100}} onoutroend={()=>{shows[0]=false;shows[1]=true}}>
<Button onmouseup={()=>showing = !showing}  class="bg-gray-800">
    ☰
</Button>
</span>
{:else if shows[1]}
    <span class="rounded pt-0 bg-gray-800" in:fade={{duration:100,delay:50}} out:fade={{duration:100}} onoutroend={()=>{shows[1]=false;shows[0]=true}}>
    {#each paths as path}
    <p class="text-lg px-5" >
        {#if path !== pathname}
        <a href={path}>{uppercase(path)}</a>
        {:else}
        {uppercase(path)}
        {/if}
    </p>
    {/each}
</span>
{/if}
</main>