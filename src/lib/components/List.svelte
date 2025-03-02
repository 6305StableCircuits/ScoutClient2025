<script lang="ts">
    import type { Snippet } from 'svelte';
    import Button from '$lib/components/Button.svelte';
    import { splitParts } from '$lib';
    interface Props<T> {
        list?: T[];
        length?: number;
        item: Snippet<[T, number]>;
        head?: Snippet;
        table?: boolean;
    }
    let { list = [], length = 10, item, head, table = false }: Props<any> = $props();
    let page = $state(0);
    let parts = $derived(splitParts(list, length));
    $inspect(parts[page]);
    function decrement() {
        if (page - 1 in parts) {
            page--;
        }
    }
    function increment() {
        if (page + 1 in parts) {
            page++;
        }
    }
    let headTag = $state('span');
    let mainTag = $state('span');
    //eval('$$anchor')?.tagName === "TABLE"
    if (table) {
        headTag = 'thead';
        mainTag = 'table';
    }
</script>

<span>
    <Button onclick={decrement}>🞀</Button>&nbsp;
    {page}&nbsp;<Button onclick={increment}>🞂</Button>
</span><br />
<svelte:element this={mainTag}>
    <svelte:element this={headTag}>
        {@render head?.()}
    </svelte:element>
    <svelte:element this={headTag ? 'tbody' : 'span'}>
        {#each parts[page] as part, i}
            {@render item?.(part, i)}
        {/each}
    </svelte:element>
</svelte:element>
