<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { StyleSize } from '$lib/types';
    interface Props {
        [event: `on${string}`]: (this: HTMLButtonElement, event: Event) => any;
        children?: Snippet;
        width?: number;
        height?: number;
        textSize?: StyleSize;
        class?: string;
        [x: string]: any;
    }
    let {
        children,
        width = 20,
        textSize = '2xl',
        height,
        class: className = '',
        ...props
    }: Props = $props();
</script>

<!--
@component
This is a button. Use it instead of `<button>`.
You can customize its width, height, and text size. 
  -->
<button
    type="button"
    {...props}
    class={`disabled:saturate-[0.5] disabled:hover:brightness-100 transition-all px-lg py-md mt-sm mx-sm text-${textSize} ${height ? `h-[${height}%]` : ``} w-[${width}%] bg-[#135fef] hover:brightness-110 text-white rounded ${className} `}
    >&nbsp;{@render children?.()}&nbsp;</button
>
