<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Snippet } from 'svelte';
    type Props = {
        url: string;
        children: Snippet;
        title?: string;
        class?: string;
        underline?: boolean;
        onclick?: (event: MouseEvent) => unknown;
        [x: string]: any;
    };
    let {
        url,
        children,
        title = '',
        class: className = '',
        underline = true,
        onclick = () => {},
        ...props
    }: Props = $props();
    let control_held = false;
    function handle_keypress(event: KeyboardEvent) {
        if (event.key === 'Control') {
            control_held = event.type === 'keydown';
        }
    }
    function handle_click(this: HTMLSpanElement, event: MouseEvent) {
        onclick.call(this, event);
        if (control_held) {
            window.open(url);
        } else {
            goto(url);
        }
    }
</script>

<svelte:body onkeydown={handle_keypress} onkeyup={handle_keypress} />
<!--svelte-ignore a11y_no_static_element_interactions-->
<!--svelte-ignore a11y_click_events_have_key_events-->
<span
    {title}
    class="transition cursor-pointer hover:cursor-pointer dark:text-white hover:text-slate-300 {underline
        ? 'underline'
        : ''} {className}"
    {...props}
    onclick={handle_click}
>
    {@render children?.()}
</span>
