<script lang="ts">
    import { settings } from '$lib/stores';
    import Button from '$lib/components/Button.svelte';
    import { pretty } from '$lib';
    import fish from '$lib/assets/fish-spinning-compressed.gif?enhanced';
    //nowhere near completion
</script>

<main>
    <h1 class="text-lg">Settings</h1>
    <h2>Theme</h2>
    <select
        bind:value={
            () => pretty($settings.mode),
            v =>
                v === 'auto'
                    ? ($settings.mode = window.matchMedia('prefers-color-scheme: dark')
                          ? 'dark'
                          : 'light')
                    : ($settings.mode = v as typeof $settings.mode)
        }
        class="px-2 py-1 dark:bg-[#222222] rounded bg-[#dddddd]"
    >
        <option value="auto">Auto</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
    </select>
    <br />
    <h2>
        Fish <enhanced:img src={fish} alt="fish" class="inline w-[10%] h-[10%]" /><br />
        <Button disabled={$settings.fish} onclick={() => ($settings.fish = true)} class="text-sm"
            >Yes Please :&rpar;</Button
        ><br />
        <Button disabled={!$settings.fish} onclick={() => ($settings.fish = false)} class="text-sm"
            >No, I have no taste</Button
        >
    </h2>
</main>
