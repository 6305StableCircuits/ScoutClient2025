<script lang="ts">
	import type { PageData } from './$types';
	import type {TeamData,Score,Match} from '$lib/types';
	import Config from '$lib/config';
	import Graph from '$lib/components/Graph.svelte';
	import {uppercase,coerce,deNaN,getAverageScore} from '$lib';
	let { data }: { data: PageData } = $props();
	let teamData: TeamData;
	let td = $state({
		number: data.number,
		avg: {
			score: getAverageScore(data.matches)
		},
		matches: data.matches
	})
	console.log(td.avg);
	function sortMatches(matches:Match[]):Match[]{
		return matches.sort((a,b)=>a.match-b.match);
	}
	function formatForGraph(matches:Match[]):any[]{
		return sortMatches(matches).map(match=>{
			return {
				x: match.match,
				y: match.score.overall
			}
		})
	}
	let graphData = $state(formatForGraph(td.matches));
	console.log(graphData);
	let teamImg = $state<HTMLImageElement>();
</script>
<main class="text-center place-content-center content-center">
	<h1 class="text-lg">Team {td.number} <img class="inline" bind:this={teamImg} onerror={()=>teamImg!.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="} alt={coerce<string>(td.number)} src="https://www.thebluealliance.com/avatar/{(new Date()).getFullYear()}/frc{td.number}.png" /></h1>
	<h2>Average</h2>
	<div class="border border-white rounded">
		<details><summary>Score: {td.avg.score.overall}</summary>
			<p>
				Auto: {td.avg.score.auto.score}<br>
				Teleop: {td.avg.score.teleop.score}
			</p>
		</details>
		<details>
			<summary>Accuracy: {Math.trunc(deNaN(td.avg.score.accuracy.overall*100))}%</summary>
			<p>
				{uppercase(Config.primaryScore.name)}: {Math.trunc(deNaN(td.avg.score.accuracy[Config.primaryScore.name]*100))}%<br>
				{uppercase(Config.secondaryScore.name)}: {Math.trunc(deNaN(td.avg.score.accuracy[Config.secondaryScore.name]*100))}%
			</p>
		</details>
	</div>
	<h2>Autonomous</h2>
	<div class="border border-white rounded">
		{uppercase(Config.primaryScore.name)}: {deNaN(td.avg.score.auto[Config.primaryScore.name].amount)}<br>
		{uppercase(Config.secondaryScore.name)}: {deNaN(td.avg.score.auto[Config.secondaryScore.name].amount)}
	</div>
	<h2>Performance Over Time</h2>
	<center>
		<Graph data={graphData} />
	</center>
</main>