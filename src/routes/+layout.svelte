<script>
import "../app.css";
import "@fontsource/inter";
import Nav from '$lib/components/Nav.svelte';
import {fade} from 'svelte/transition';
</script>
<main in:fade out:fade class="font-inter mt-[-10px]">
    <Nav />
    <slot></slot>
</main>