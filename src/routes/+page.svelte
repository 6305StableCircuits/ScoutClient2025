<script lang="ts">
    import Link from '$lib/components/Link.svelte';
    import horse from '$lib/assets/blue-horse.png';
    // let count = $state(0);
    // let double = $derived(count * 2);
    // let isHigh = $state(false);
    // $effect(() => {
    //     //this could have been a $derived, but i made it an effect to show how it works
    //     if (count > 10) {
    //         isHigh = true;
    //     }
    // });
    // $inspect(count);
    // let object: any = $state({ hi: true, i: { hi: true, string: 'hi', arr: [1, 2, 3] } });
    // $inspect(object);
    // let data = $state<{ x: number; y: number }[]>([]);
    // function genData() {
    //     data = [];
    //     for (let i = 0; i < 200; i++) {
    //         data.push({ x: i, y: Math.random() * 200 });
    //     }
    // }
    // genData();
</script>

<svelte:head>
    <title>ScoutClient 2025</title>
</svelte:head>
<main style="display:flex;flex-direction:column;align-items:center;">
    <img src={horse} alt="Honse" />
    <h1 style="font-size: 40px; font-weight:700; margin-bottom:1em">6305 Scouting</h1>
    <div style="display: flex; flex-direction:column">
        <Link
            style="background-color:blue; border-radius:6px; padding:1em 2em;text-align:center;text-decoration:none;font-size:20px;margin-bottom:1em"
            url="scout">Scout</Link
        >
        <Link
            style="background-color:darkblue; border-radius:6px; padding:1em 2em;text-align:center;text-decoration:none;font-size:20px;margin-bottom:1em"
            url="save">Save Your Data</Link
        >
        <Link
            style="background-color:green; border-radius:6px; padding:1em 2em;text-align:center;text-decoration:none;font-size:20px;margin-bottom:1em"
            url="data">Leaderboards</Link
        >
    </div>
    <!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button onclick={()=>count++} textSize="sm">Count is {count}</Button> {count} * 2 = {double}<br>
{#if isHigh}
<Rainbow>Whoa, that's a high number!</Rainbow>
{/if}
<br>
<Tree bind:object pretty={true}/>
<Graph {data}/> -->
</main>
