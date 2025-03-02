<script lang="ts">
    import { settings } from '$lib/stores';
    import Button from '$lib/components/Button.svelte';
    import { pretty } from '$lib';
    import fish from '$lib/assets/fish-spinning-compressed.gif';
    //nowhere near completion
</script>

<main>
    <h1 class="text-lg">Settings</h1>
    <h2>Theme</h2>
    <select
        bind:value={
            () => pretty($settings.mode),
            (v) =>
                v === 'Auto'
                    ? ($settings.mode = window.matchMedia('prefers-color-scheme: dark')
                          ? 'dark'
                          : 'light')
                    : ($settings.mode = v.toLowerCase() as typeof $settings.mode)
        }
        class="px-2 py-1 dark:bg-[#222222] rounded bg-[#dddddd]"
    >
        <option value="Auto">Auto</option>
        <option value="Dark">Dark</option>
        <option value="Light">Light</option>
    </select>
    <br />
    <h2>
        Fish <img src={fish} alt="fish" class="inline w-[10%] h-[10%]" /><br />
        <Button disabled={$settings.fish} onclick={() => ($settings.fish = true)} class="text-sm"
            >Yes Please :)</Button
        ><br />
        <Button disabled={!$settings.fish} onclick={() => ($settings.fish = false)} class="text-sm"
            >No, I have no taste</Button
        >
    </h2>
</main>

<style>
</style>
