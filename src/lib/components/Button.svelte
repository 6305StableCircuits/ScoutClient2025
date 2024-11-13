<script lang="ts">
    import type {Snippet} from 'svelte';
    import type {StyleSize} from '$lib/types';
    interface Props {
        [event: `on${string}`]: ()=>any,
        children?: Snippet,
        width?:number,
        height?:number,
        textSize?:StyleSize,
        class?: string
    }
    let {children,width=20,textSize="2xl",height,class:className,...props}:Props = $props();
</script>
<!--
@component
This is a button. Use it instead of `<button>`.
You can customize its width, height, and text size. 
  -->
<button {...props} class={`${className} px-lg py-md mt-sm mx-sm text-${textSize} ${height ? `h-[${height}%]` : ``} w-[${width}%] bg-[#135fef] text-white rounded hover:text-blue`}>&nbsp;{@render children?.()}&nbsp;</button>