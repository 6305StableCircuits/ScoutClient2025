<script lang="ts">
	import type { PageData } from './$types';
	import type {TeamData} from '$lib/types'
	import {onMount} from 'svelte';
	let { data }: { data: PageData } = $props();
	let teamData: TeamData;
	let td = {
		number: data.number,
		avg: {
			score: {}
		},
		matches: data.matches
	}
</script>
<!-- 
<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div> -->