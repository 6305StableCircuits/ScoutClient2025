<script lang="ts">
    import Tree from '$lib/components/Tree.svelte';
    import type {Snippet} from 'svelte';
    interface Props{
        object:{[x:string]:any},
        editable?:boolean,
        pretty?:boolean,
        children?: Snippet,
    }
    let {object = $bindable<{[x:string|number]:any}>(), editable = false, pretty = false, children}:Props = $props();
    let entries = $derived(Object.entries(object));
    function prettify(name:string):string{
        return name.replace(/[A-Z]/g,(m:string)=>` ${m}`).replace(/^[a-z]/,(m:string)=>m.toUpperCase()).replace(/[_-]/g,' ').replace(/ [a-z]/g,(m)=>m.toUpperCase());
    }
</script>
<!--
@component
A JSON tree component. 
It can make both editable and readonly JSON trees.
It can also prettify camelCase, PascalCase, kebab-case, and snake_case. 
-->
<style>
    :root{
        margin: 0px auto;
        left: 4em;
    }
    details{
        display: inline;
        margin-left: 2em;
        margin-top: 0px auto;
    }
    summary {
        margin-left: -2em;
    }
</style>
<div class="ml-10 mt-0 pt-0 pb-0">
{#each entries as [name, value]}
    <details>
        <summary>
            {#if pretty}
                {prettify(name)}
            {:else}
                {name}
            {/if}
        </summary>
        {#if typeof value === "object" && value !== null}
            {#if value !== object}
                <Tree bind:object={object[name.toString()]} {editable} {pretty}/>
            {:else}
                Circular Reference
            {/if}
        {:else}
            {#if editable}
                {#if typeof value === "boolean"}
                    <select bind:value={object[name.toString()]} ><option value={true}>true</option><option value={false}>false</option></select>
                {:else if typeof value === "number"}
                    <input type="number" bind:value={object[name.toString()]} />
                {:else if typeof value === "string"}
                    <input type="text" bind:value={object[name.toString()]} />
                {:else}
                    {#if typeof value === "function"}
                        [ƒ {value.name}]
                    {:else}
                        {value}
                    {/if}
                {/if}
            {:else}
                {#if typeof value === "function"}
                    [ƒ {value.name}]
                {:else}
                    {value}
                {/if}
            {/if}
        {/if}
    </details>
    {:else}
        {@render children?.()}
{/each}
</div>