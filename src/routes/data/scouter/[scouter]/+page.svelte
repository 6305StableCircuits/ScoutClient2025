<script lang="ts">
    import type { PageData } from './$types';
    import type { Match } from '$lib/types';
    let { data }: { data: PageData } = $props();
    function rankScouters(matches: Match[]): string[] {
        let scouters = matches.map((match: Match) => match.scout);
        let keys = [...new Set<string>(scouters)];
        let values = keys.map((key) => scouters.filter((s) => s === key).length);
        let results = keys.sort((a, b) => values[keys.indexOf(b)] - values[keys.indexOf(a)]);
        return results;
    }
    let preferred = $derived.by<Match['alliance']>(() => {
        let blue = data.matches.filter((match: Match) => match.alliance === 'blue').length;
        let red = data.matches.filter((match: Match) => match.alliance === 'red').length;
        return blue > red ? 'blue' : 'red';
    });
    let teams = $derived.by<number[]>(() => {
        let arr = data.matches.map((match: Match) => match.team);
        return [...new Set<number>(arr)];
    });
    $effect.pre(() => {
        document.title = `${data.scouter} - ScoutClient 2025 Scouters`;
    });
    let rank = $derived(rankScouters(data.matches).indexOf(data.scouter) + 1);
</script>

<main class="text-center">
    <h1 class="text-lg">Scouter: {data.scouter}</h1>
    <h2>Matches scouted: {data.matches.length}</h2>
    <h2>Preferred Alliance: {preferred}</h2>
    <h2>Teams scouted: {teams.length}</h2>
    <h2>Rank: {rank}</h2>
</main>
