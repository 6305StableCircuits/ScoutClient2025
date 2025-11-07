<script lang="ts">
    import type { PageProps } from './$types';
    import type { TeamData } from '$lib/types';
    import Config from '$lib/config';
    import Graph from '$lib/components/Graph.svelte';
    import { uppercase, coerce, deNaN, get_average_score } from '$lib';
    import Match from '$lib/Match.svelte';
    let { data }: PageProps = $props();
    let teamData: TeamData;
    let td = $state({
        number: data.number,
        avg: {
            score: get_average_score(data.matches)
        },
        matches: data.matches
    });
    console.log(td.avg);
    function sort_matches(matches: Match[]): Match[] {
        return matches.sort((a, b) => a.match - b.match);
    }
    function format_for_graph(matches: Match[]): any[] {
        return sort_matches(matches).map(match => {
            return {
                x: match.match,
                y: match.score.overall
            };
        });
    }
    let graph_data = $state(format_for_graph(td.matches));
    console.log(graph_data);
    let team_img = $state<HTMLImageElement>();
    let notes = $derived(data.matches.map((match: Match) => [match.match, match.notes]));
    function fallback(img: HTMLImageElement) {
        $effect(() => {
            const on_error = () => {
                img.src =
                    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            };
            img.addEventListener('click', on_error);
            return () => img.removeEventListener('click', on_error);
        });
    }
</script>

<main class="text-center place-content-center content-center">
    <h1 class="text-lg">
        Team {td.number}
        <img
            class="inline"
            {@attach fallback}
            alt={td.number.toString()}
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
                        deNaN(td.avg.score.accuracy[score.name] * 100)
                    )}%<br />
                {/each}
            </p>
        </details>
    </div>
    <h2>Autonomous</h2>
    <div class="border border-white rounded">
        {#each Config.scoring as score}
            {uppercase(score.name)}: {deNaN(td.avg.score.auto[score.name].amount)}<br />
        {/each}
    </div>
    <h2>Teleop</h2>
    <div class="border border-white rounded">
        {#each Config.scoring as score}
            {uppercase(score.name)}: {deNaN(td.avg.score.teleop[score.name].amount)}<br />
        {/each}
    </div>
    <h2>Performance Over Time</h2>
    <center>
        <Graph data={graph_data} />
    </center>
    <h2>Notes</h2>
    {#each notes as [match, note]}
        <b>Match {match}</b>: {note}<br />
    {/each}
</main>
