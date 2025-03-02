<script lang="ts">
    import type { PageData } from './$types';
    import type { Match } from '$lib/types';
    import { coerce } from '$lib';
    import Link from '$lib/components/Link.svelte';
    let { data }: { data: PageData } = $props();
    let scores = $derived({
        blue: data.matches
            .filter((match: Match) => match.alliance === 'blue')
            .map((match: Match) => match.score.overall)
            .reduce((a: number, b: number) => a + b, 0),
        red: data.matches
            .filter((match: Match) => match.alliance === 'red')
            .map((match: Match) => match.score.overall)
            .reduce((a: number, b: number) => a + b, 0)
    });
    let teams = $derived({
        blue: data.matches.filter((match: Match) => match.alliance === 'blue'),
        red: data.matches.filter((match: Match) => match.alliance === 'red')
    });
    $effect.pre(() => {
        document.title = `Match ${data.number} - ScoutClient2025`;
    });
</script>

<main class="text-center content-center">
    <h1 class="text-lg">Match {data.number}</h1>
    <h2>
        Winner: <span class="text-[{scores.blue > scores.red ? 'blue' : 'red'}]"
            >{scores.blue > scores.red ? 'Blue Alliance' : 'Red Alliance'}</span
        >
    </h2>
    <h2>Teams</h2>
    <details>
        <summary class="text-[blue]">Blue Alliance (Score: {scores.blue})</summary>
        <p>
            {#each teams.blue as team}
                {@const { scout, score } = team}
                <details>
                    <summary>Team <Link url="/data/team/{team.team}">{team.team}</Link></summary>
                    <span>
                        Scouted by {scout}<br />
                        Score: {score.overall}<br />
                        Contributed: {(score.overall / scores.blue) * 100}%
                    </span>
                </details>
            {/each}
        </p>
    </details>
    <br />
    <details>
        <summary class="text-[red]">Red Alliance (Score: {scores.red})</summary>
        <p>
            {#each teams.red as team}
                {@const { scout, score } = team}
                <details>
                    <summary>Team {team.team}</summary>
                    <span>
                        Scouted by {scout}<br />
                        Score: {score.overall}
                        Contributed: {(score.overall / scores.red) * 100}%
                    </span>
                </details>
            {/each}
        </p>
    </details>
</main>

<style>
    details {
        display: inline;
        margin-left: 2em;
    }
    summary {
        margin-left: -2em;
    }
</style>
