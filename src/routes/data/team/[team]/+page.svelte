<script lang="ts">
    import type { PageData } from './$types';
    import type { TeamData, Score, Match } from '$lib/types';
    import Config from '$lib/config';
    import Graph from '$lib/components/Graph.svelte';
    import { uppercase, coerce, deNaN, getAverageScore } from '$lib';
    let { data }: { data: PageData } = $props();
    let teamData: TeamData;
    let td = $state({
        number: data.number,
        avg: {
            score: getAverageScore(data.matches)
        },
        matches: data.matches
    });
    console.log(td.avg);
    function sortMatches(matches: Match[]): Match[] {
        return matches.sort((a, b) => a.match - b.match);
    }
    function formatForGraph(matches: Match[]): any[] {
        return sortMatches(matches).map((match) => {
            return {
                x: match.match,
                y: match.score.overall
            };
        });
    }
    let graphData = $state(formatForGraph(td.matches));
    console.log(graphData);
    let teamImg = $state<HTMLImageElement>();
    let notes = $derived(data.matches.map((match: Match) => [match.match, match.notes]));
</script>

<main class="text-center place-content-center content-center">
    <h1 class="text-lg">
        Team {td.number}
        <img
            class="inline"
            bind:this={teamImg}
            onerror={() =>
                (teamImg!.src =
                    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')}
            alt={coerce<string>(td.number)}
            src="https://www.thebluealliance.com/avatar/{new Date().getFullYear()}/frc{td.number}.png"
        />
    </h1>
    <h2>Average</h2>
    <div class="border border-white rounded">
        <details>
            <summary>Score: {td.avg.score.overall}</summary>
            <p>
                Auto: {td.avg.score.auto.score}<br />
                Teleop: {td.avg.score.teleop.score}
            </p>
        </details>
        <details>
            <summary>Accuracy: {Math.trunc(deNaN(td.avg.score.accuracy.overall * 100))}%</summary>
            <p>
                {#each Config.scoring as score}
                    {uppercase(score.name)}: {Math.trunc(
                        deNaN(td.avg.score.accuracy[coerce<number>(score.name)] * 100)
                    )}%<br />
                {/each}
            </p>
        </details>
    </div>
    <h2>Autonomous</h2>
    <div class="border border-white rounded">
        {#each Config.scoring as score}
            {uppercase(score.name)}: {deNaN(
                td.avg.score.auto[coerce<number>(score.name)].amount
            )}<br />
        {/each}
    </div>
    <h2>Teleop</h2>
    <div class="border border-white rounded">
        {#each Config.scoring as score}
            {uppercase(score.name)}: {deNaN(
                td.avg.score.teleop[coerce<number>(score.name)]['amount' as keyof typeof td.avg.score.teleop[number]]
            )}<br />
        {/each}
    </div>
    <h2>Performance Over Time</h2>
    <center>
        <Graph data={graphData} />
    </center>
    <h2>Notes</h2>
    {#each notes as [match, note]}
    <b>Match {match}</b>: {note}<br />
    {/each}
</main>
