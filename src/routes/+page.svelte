<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Rainbow from '$lib/components/Rainbow.svelte';
    import Tree from '$lib/components/Tree.svelte';
    let count = $state(0);
    let double = $derived(count*2);
    let isHigh = $state(false);
    $effect(()=>{ //this could have been a $derived, but i made it an effect to show how it works
        if(count > 10){
            isHigh = true;
        }
    })
    $inspect(count);
    let object:any = $state({hi:true,i:{hi:true,string:"hi",arr:[1,2,3]}});
    $inspect(object);
</script>
<main> 
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button onclick={()=>count++} textSize="sm">Count is {count}</Button> {count} * 2 = {double}<br>
{#if isHigh}
<Rainbow>Whoa, that's a high number!</Rainbow>
{/if}
<br>
<Tree bind:object pretty={true}/>
</main>