<script lang="ts">
    import type { PageData } from './$types';
    import { uppercase, rank, splitParts, chooseAlliances, pretty, coerce } from '$lib';
    import type { Match } from '$lib/types';
    import Link from '$lib/components/Link.svelte';
    import List from '$lib/components/List.svelte';
    import Tree from '$lib/components/Tree.svelte';
    import { onMount } from 'svelte';
    import Button from '$lib/components/Button.svelte';
    import ClickForMore from '$lib/components/ClickForMore.svelte';
    import { TableHandler } from '@vincjo/datatables';
    import { Datatable } from '@vincjo/datatables';
    import { ThSort, ThFilter } from '@vincjo/datatables';
    let { data }: { data: PageData } = $props();
    console.log(data);
    let rankings = $state(rank(data.matches));
    let alliances = $derived(chooseAlliances(rankings));
    let betterData = $state(data.matches);
    // svelte-ignore state_referenced_locally
    const table = new TableHandler(betterData, { rowsPerPage: 10, highlight: false });
    let keysss = ['match', 'team', 'alliance', 'scout', 'date', 'score', 'notes'] as const;

    async function get() {
        let headers: RequestInit = {
            method: 'GET'
        };
        let res = await fetch('../supabase', headers);
        betterData = (await res.json())?.scoutingData as Match[];
        console.log(betterData);
        table.setRows(betterData);
        if (res.status === 200) {
            return true;
        }
        return false;
    }
</script>

<main class="text-center content-center">
    <Button onclick={get} class="absolute right-12.8 mt-2.5 text-xl">Refresh</Button>
    <Datatable basic {table}>
        <table>
            <thead>
                <tr>
                    {#each keysss as key}
                        <ThSort {table} field={key as (typeof keysss)[number]}>{pretty(key)}</ThSort
                        >
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each table.rows as row}
                    <tr>
                        {#each keysss as key}
                            {@const bullshit = row[key as keyof typeof row]}
                            {#if key === 'notes'}
                                {#if bullshit && coerce<string>(bullshit)?.length}
                                    <td><ClickForMore stuff={coerce<string>(bullshit)} /></td>
                                {:else}
                                    <td><i class="text-zinc-500">None Provided</i></td>
                                {/if}
                            {:else if key === 'score'}
                                <td>{(bullshit as Record<string, any>)?.overall}</td>
                            {:else if key === 'team' || key === 'match' || key === 'scout'}
                                <td
                                    ><Link
                                        style="text-shadow: 0 0 1px #9999ff"
                                        url="/data/{key === 'scout' ? 'scouter' : key}/{bullshit}"
                                        >{bullshit}</Link
                                    ></td
                                >
                            {:else if key === 'date'}
                                <td>{new Date(coerce<string>(bullshit)).toLocaleDateString()}</td>
                            {:else if key === 'alliance'}
                                <td style="color:{bullshit}">{pretty(coerce<string>(bullshit))}</td>
                            {:else}
                                <td>{bullshit}</td>
                            {/if}
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </Datatable>
    <!-- <h1 class="text-lg">Match Data</h1>
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
    </center> -->
    <h1 class="text-lg">Predictions</h1>
    <div class="border border-white rounded">
        <h2>Rankings</h2>
        <ol type="1" start={1} class="text-left ml-[40%]">
            {#each rankings as team, rank}
                <li><b>{rank + 1}</b>. {team}</li>
            {/each}
        </ol>
        <h2>Alliances</h2>
        <ol type="1" start={1} class="text-left ml-[40%]">
            {#each alliances as alliance, rank}
                <li>
                    <b>{rank + 1}</b>.
                    {#each alliance as team}
                        <Link url="./data/team/{team}">{team}</Link>,&nbsp;
                    {/each}
                </li>
            {/each}
        </ol>
    </div>
</main>
