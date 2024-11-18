<script lang="ts">
    import {goto} from '$app/navigation';
    import type {Snippet} from 'svelte';
    type Props = {
        url: string;
        children: Snippet;
        title?: string;
        class?: string;
        underline?: boolean;
        onclick?: ()=>any;
    }
    let {url,children,title="",class:className="",underline=true,onclick=()=>{}}:Props = $props();
</script>
<!--svelte-ignore a11y_no_static_element_interactions-->
<!--svelte-ignore a11y_click_events_have_key_events-->
<span {title} class="transition cursor-pointer hover:cursor-pointer dark:text-white hover:text-slate-300 {underline?"underline":""} {className}" onclick={()=>{onclick();goto(url)}}>
    {@render children?.()}
</span>