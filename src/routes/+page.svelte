<script lang="ts">
    //@ts-nocheck
    // import supabase from './api/apiKey.server.js'
    import Button from '$lib/components/Button.svelte';
    import Rainbow from '$lib/components/Rainbow.svelte';
    import Tree from '$lib/components/Tree.svelte';
    import Graph from '$lib/components/Graph.svelte';
    import type {PostgrestFilterBuilder} from '@supabase/postgrest-js';
    let count = $state(0);
    let double = $derived(count*2);
    let isHigh = $state(false);
    let {data} = $props();
    //@ts-ignore
    let {countries}:{countries:Record<string, any[]>} = data;
    globalThis.countries = countries;
    $effect(()=>{ //this could have been a $derived, but i made it an effect to show how it works
        if(count > 10){
            isHigh = true;
        }
    })
    $inspect(count);
    let object:any = $state({hi:true,i:{hi:true,string:"hi",arr:[1,2,3]}});
    $inspect(object);
    let data1 = $state<{x:number,y:number}[]>([]);
    function genData(){
		data1 = [];
		for(let i = 0; i<200;i++){
			data1.push({x:i,y:Math.random()*200});
		}
	}
	genData();
    $inspect(countries.data);
</script>
<svelte:head>
    <title>ScoutClient 2025</title>
</svelte:head>
<main> 
    <ul>
        {#each countries.data as country}
          <li>{country.TeamName}</li>
        {/each}
    </ul>
<p></p>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button onclick={()=>count++} textSize="sm">Count is {count}</Button> {count} * 2 = {double}<br>
{#if isHigh}
<Rainbow>Whoa, that's a high number!</Rainbow>
{/if}
<br>
<Tree bind:object pretty={true}/>
<Graph data={data1}/>
</main>