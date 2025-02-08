<script lang="ts">
    import {settings} from '$lib/stores';
    import Button from '$lib/components/Button.svelte';
    //nowhere near completion
</script>
<style>

</style>
<main>
    <h1 class="text-lg">Settings</h1>
    <h2>Theme</h2>
    <select class="px-2 py-1 dark:bg-[#222222] rounded bg-[#dddddd]">
        <option value="Auto">Auto</option>
        <option value="Dark">Dark</option>
        <option value="Light">Light</option>
    </select>
    <br>
    <h2>Fish <img src="./src/routes/fish-spinning-compressed.gif" alt="fish" class="inline w-[10%] h-[10%]"/></h2>
</main>