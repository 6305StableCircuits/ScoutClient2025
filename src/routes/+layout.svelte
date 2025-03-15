<script>
    import '../app.css';
    import '@fontsource/inter';
    import Nav from '$lib/components/Nav.svelte';
    import { navigating, page } from '$app/state';
    import { fade } from 'svelte/transition';
    import { settings } from '$lib/stores';
    import fish from '$lib/assets/fish-spinning-compressed.gif';
    //globalThis["$"] = eval("$");
    let loaded = $state(false);
    let { children } = $props();
    $effect(() => {
        navigating.from;
        if (!navigating.from) {
            setTimeout(() => (loaded = true), 200);
        } else {
            loaded = false;
        }
    });
</script>

<header class="font-inter mt-[-10px] {$settings.mode}">
    <Nav />
</header>
<main in:fade out:fade class="font-inter {$settings.mode}">
    {#if $settings.fish && !loaded}
        <img
            src={fish}
            in:fade={{ delay: 50 }}
            out:fade={{ duration: 200 }}
            alt="Loading..."
            class="content-center w-100 h-100"
        />
    {:else}
        <br />
        {@render children?.()}
    {/if}
</main>
