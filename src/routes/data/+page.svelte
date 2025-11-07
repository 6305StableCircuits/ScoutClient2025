<script lang="ts">
    import type { PageProps } from './$types';
    import { rank, choose_alliances, pretty, coerce } from '$lib';
    import Match from '$lib/Match.svelte';
    import Link from '$lib/components/Link.svelte';
    import Button from '$lib/components/Button.svelte';
    import ClickForMore from '$lib/components/ClickForMore.svelte';
    import { TableHandler } from '@vincjo/datatables';
    import { Datatable } from '@vincjo/datatables';
    import { ThSort } from '@vincjo/datatables';
    import { matches } from './db.remote';
    let { data }: PageProps = $props();
    let background = 'rgb(0,0,0)';
    let foreground = 'rgb(255,255,255)';
    let datata = [
        [1, 2],
        [2, 2]
    ];
    let better_data = $state<Match[]>(data.matches);
    const rankings = $derived(rank(better_data));
    const alliances = $derived(choose_alliances(rankings));
    // svelte-ignore state_referenced_locally
    const table = new TableHandler(better_data, { rowsPerPage: 10, highlight: false });
    const tabl = new TableHandler(datata, { rowsPerPage: 10, highlight: false });
    const keysss = ['match', 'team', 'alliance', 'scout', 'date', 'score', 'notes'];
    const teamkeys = [
        'Team',
        'Match',
        'Overall',
        'Auto',
        'L1 (Amount)',
        'L2',
        'L3',
        'L4',
        'Processor',
        'Net',
        'Barge',
        'Accuracy'
    ];
    const teams = $derived<number[]>([...new Set(better_data.map(({ team }) => Number(team)))]);
    const teamstuff = $derived.by(() => {
        return teams.map(team => {
            let matches = better_data.filter(({ team: _team }) => _team === team);
            let sorted = matches.toSorted((a, b) => b.date - a.date);
            return sorted[0];
        });
    });
    // svelte-ignore state_referenced_locally
    tabl.setRows(teamstuff as any);
    const get_matches = matches();
    async function get() {
        const matches = await get_matches;
        if (JSON.stringify(matches) !== JSON.stringify(better_data)) {
            better_data = matches;
            table.setRows(better_data);
            tabl.setRows(teamstuff as any);
        }
        return false;
    }
</script>

<main class="text-center content-center">
    <Button onclick={get} class="absolute right-12.8 mt-2.5 text-xl">Refresh</Button>
    <Datatable basic {table}>
        <table>
            <thead style="background-color:{background}">
                <!-- rgb(219, 219, 219) -->
                <tr style="color:{foreground}">
                    {#each keysss as key}
                        <ThSort {table} field={key as keyof Match}>{pretty(key)}</ThSort>
                    {/each}
                </tr>
            </thead>
            <tbody class="thiskew" style="border-color:{foreground};">
                {#each table.rows as row}
                    <tr>
                        {#each keysss as key}
                            {@const bullshit = row[key as keyof typeof row]}
                            {#if key === 'notes'}
                                {#if bullshit && coerce<string>(bullshit)?.length}
                                    <td style="color:{foreground};border: 1px solid {foreground};"
                                        ><ClickForMore stuff={coerce<string>(bullshit)} /></td
                                    >
                                {:else}
                                    <td style="color:{foreground};border: 1px solid {foreground};"
                                        ><i class="text-zinc-500">None Provided</i></td
                                    >
                                {/if}
                            {:else if key === 'score'}
                                <td style="color:{foreground};border: 1px solid {foreground};"
                                    >{(bullshit as Record<string, any>)?.overall}</td
                                >
                            {:else if key === 'team' || key === 'match' || key === 'scout'}
                                <td style="border: 1px solid {foreground}"
                                    ><Link
                                        style="text-shadow: 0 0 1px #9999ff; color:{foreground};"
                                        url="/data/{key === 'scout' ? 'scouter' : key}/{bullshit}"
                                        >{bullshit}</Link
                                    ></td
                                >
                            {:else if key === 'date'}
                                <td style="color:{foreground};border: 1px solid {foreground};"
                                    >{new Date(coerce<string>(bullshit)).toLocaleDateString()}</td
                                >
                            {:else if key === 'alliance'}
                                <td style="color:{bullshit};border: 1px solid {foreground};"
                                    >{pretty(coerce<string>(bullshit))}</td
                                >
                            {:else}
                                <td style="color:{foreground};border: 1px solid {foreground};"
                                    >{bullshit}</td
                                >
                            {/if}
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </Datatable>
    <h2 style="font-size:1.5em">Team Scores</h2>
    <!-- {@html JSON.stringify(teamstuff, null, 4).replace(/\n/g, '<br />')} -->
    <Datatable basic table={tabl}>
        <table>
            <thead style:--background={background} style="background-color: var(--background)">
                <tr style="color:{foreground}">
                    {#each teamkeys as key}
                        <ThSort {table} field={key as keyof Match}>{pretty(key)}</ThSort>
                    {/each}
                </tr>
            </thead>
            <tbody class="thiskew" style="border-color:{foreground};">
                {#each teamstuff as key, i}
                    <tr>
                        <!-- {#each Object.entries(key), k} -->
                        <td style="color:{foreground};border: 1px solid {foreground}">{teams[i]}</td
                        >
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key['match']}</td
                        >
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key['score']['overall']}</td
                        >
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key.score['auto']['score']}</td
                        >
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key.score['teleop']['coral (trough)']['amount']}</td
                        >
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key.score.teleop['coral (l2 branch)'].amount}</td
                        >
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key.score.teleop['coral (l3 branch)'].amount}</td
                        >
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key.score.teleop['coral (l4 branch)'].amount}</td
                        >
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key.score.teleop['algae (processor)'].amount}</td
                        >
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key.score.teleop['algae (net)'].amount}</td
                        >
                        {#if key.score.teleop['deep cage']}
                            <td style="color:{foreground};border: 1px solid {foreground}"
                                >Deep Cage</td
                            >
                        {:else if key.score.teleop['shallow cage']}
                            <td style="color:{foreground};border: 1px solid {foreground}"
                                >Shallow Cage</td
                            >
                            <!-- {:else if key.score.teleop['park']}
                                <td style="color:black;border: 1px solid black"
                                >Park</td
                            > -->
                        {:else}
                            <td style="color:{foreground};border: 1px solid {foreground}"
                                ><i>Not Stated</i></td
                            >
                        {/if}
                        <td style="color:{foreground};border: 1px solid {foreground}"
                            >{key.score['accuracy'].overall * 100}%</td
                        >
                        <!-- <td style="color:black;border: 1px solid black"
                                    >{((key.score.teleop.score / key.score.accuracy.overall)/135).toFixed(3)}s</td
                                > -->
                        <!-- {#each Object.keys(key.score) as bonk}
                                    <td style="color:black;border: 1px solid black"
                                        >{JSON.stringify(key.score[bonk])}</td
                                    >
                                {/each} -->
                        <!-- {/each} -->
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

<style>
    @property --background {
        inherits: false;
        syntax: '<color>';
        initial-value: #111111;
    }
    .thiskew > *:nth-child(n) {
        background-color: rgb(147, 147, 147);
    }
    .thiskew > *:nth-child(2n) {
        background-color: var(--background);
    }
    tr:hover td {
        color: black !important;
    }
</style>
