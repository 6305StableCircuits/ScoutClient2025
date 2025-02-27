<script>
    let {stuff = '', length = 19, max_width = 200} = $props();
    let preview = $derived((stuff ?? '').slice(0, length)+'...');
    let expanded = $state(false);
</script>
<svelte:element this={'style'}>
    p &#123;
        max-width: {max_width}px;
        word-wrap: break-word;
    {'}'}
</svelte:element>
{#if (stuff?.length ?? 0) < length}
    <p>{stuff}</p>
{:else}
    {#if expanded}
        <!--svelte-ignore a11y_click_events_have_key_events-->
        <!--svelte-ignore a11y_no_noninteractive_element_interactions-->
        <p onclick={() => expanded = false}>{stuff}</p>
    {:else}
        <!--svelte-ignore a11y_click_events_have_key_events-->
        <!--svelte-ignore a11y_no_noninteractive_element_interactions-->
        <p onclick={() => expanded = true}>{preview}</p>
    {/if}
{/if}