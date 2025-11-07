<script lang="ts">
    import type { PageProps } from './$types';
    import Match from '$lib/Match.svelte';
    import { pretty } from '$lib';
    const { data }: PageProps = $props();
    const scouted = data.matches.filter(({ scout }) => scout === data.scouter);
    function rank_scouters(matches: Match[]): string[] {
        const scouters = matches.map(match => match.scout);
        const keys = [...new Set<string>(scouters)];
        const values = keys.map(key => scouters.filter(s => s === key).length);
        const results = keys.sort((a, b) => values[keys.indexOf(b)] - values[keys.indexOf(a)]);
        return results;
    }
    let preferred = $derived.by<Match['alliance']>(() => {
        const blue = scouted.filter(match => match.alliance === 'blue').length;
        const red = scouted.filter(match => match.alliance === 'red').length;
        return blue > red ? 'blue' : 'red';
    });
    let teams = $derived.by<number[]>(() => {
        let arr = scouted.map(match => match.team);
        return [...new Set<number>(arr)];
    });
    $effect.pre(() => {
        document.title = `${data.scouter} - ScoutClient 2025 Scouters`;
    });
    let rank = $derived(rank_scouters(data.matches).indexOf(data.scouter) + 1);
</script>

<main class="text-center">
    <h1 class="text-lg">Scouter: {data.scouter}</h1>
    <h2>Matches scouted: {scouted.length}</h2>
    <h2>Preferred Alliance: <span class="text-[{preferred}]">{pretty(preferred)}</span></h2>
    <h2>Teams scouted: {teams.length}</h2>
    <h2>Rank: {rank}</h2>
</main>
