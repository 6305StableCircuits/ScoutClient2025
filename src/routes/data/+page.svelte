<script lang="ts">
	import type { PageData } from './$types';
    import {uppercase,rank,splitParts,chooseAlliances} from '$lib';
    import type {Match} from '$lib/types';
    import Link from '$lib/components/Link.svelte';
    import List from '$lib/components/List.svelte';
    let {data}:{data:PageData} = $props();
    let {matches} = data;
    console.log(matches);
    let rankings = $state(rank(matches));
    let alliances = $derived(chooseAlliances(rankings));
</script>
<main class="text-center content-center">
    <h1 class="text-lg">Match Data</h1>
    {#snippet item({team,score,match,alliance,scout}:Match,index:number)}
            <tr>
                <td><Link url="./data/match/{match}">{match}</Link>&nbsp;</td>
                <td><Link url="./data/team/{team}">{team}</Link>&nbsp;</td>
                <td>{score.overall}&nbsp;</td>
                <td style="color:{alliance}">{uppercase(alliance)}&nbsp;</td>
                <td><Link url="./data/scouter/{scout}">{scout}</Link>&nbsp;</td>
            </tr>
    {/snippet}
    {#snippet head()}
        <tr>
            <th>Match</th>
            <th>Team</th>
            <th>Score</th>
            <th>Alliance</th>
            <th>Scouter</th>
        </tr>
    {/snippet}
    <center class="rounded">
        <List list={matches} {item} {head} table={true}/>
    </center>
    <h1 class="text-lg">Predictions</h1>
    <div class="border border-white rounded">
    <h2>Rankings</h2>
    <ol type="1" start={1} class="text-left ml-[40%]">
        {#each rankings as team,rank}
            <li><b>{rank+1}</b>. {team}</li>
        {/each}
    </ol>
    <h2>Alliances</h2>
    <ol type="1" start={1} class="text-left ml-[40%]">
        {#each alliances as alliance, rank}
            <li><b>{rank+1}</b>. 
                {#each alliance as team}
                    <Link url="./data/team/{team}">{team}</Link>,&nbsp;
                {/each}
            </li>
        {/each}
    </ol>
</div>
</main>