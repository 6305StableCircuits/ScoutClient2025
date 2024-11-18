<script lang="ts">
    import type {Match} from '$lib/types';
    import Timer from '$lib/timer.svelte';
    import Config from '$lib/config';
    import {scouter,matches,currentMatch,alliance as allianceStore,scoutState} from '$lib/stores';
    import {fade, slide} from 'svelte/transition'; 
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import { uppercase } from '$lib';
    scouter; //used to shut up intellisense
    let score = $state({
        auto: 0,
        teleop: 0,
        get overall(){
            return score.auto+score.teleop;
        }
    });
    let misses = {
        [Config.primaryScore.name]:0,
        [Config.secondaryScore.name]:0,
    };
    let matchScore = {
        overall: 0,
        auto: {
            score: 0,
            leave: false,
            [Config.primaryScore.name]: {
                amount: 0,
                points: 0,
            },
            [Config.secondaryScore.name]: {
                amount: 0,
                points: 0,
            },
        },
        teleop: {
            score: 0,
            [Config.endGoal.name]: false,
            [Config.secondaryEndGoal.name]: false,
            [Config.primaryScore.name]: {
                amount: 0,
                points: 0
            },
            [Config.secondaryScore.name]: {
                amount: 0,
                points: 0,
            },
        },
        get accuracy(){
            let fulls = [
                matchScore.auto[Config.primaryScore.name].amount+matchScore.teleop[Config.primaryScore.name].amount,
                matchScore.teleop[Config.secondaryScore.name].amount+matchScore.auto[Config.secondaryScore.name].amount
            ];
            console.log(fulls);
            let amounts = [
                misses[Config.primaryScore.name]+fulls[0],
                misses[Config.secondaryScore.name]+fulls[1]
            ];
            console.log(amounts);
            let parts = [fulls[0]/amounts[0],fulls[1]/amounts[1]].map(n=>n!==n ? 1 : n);
            console.log(parts);
            return {
                overall: (parts[0]+parts[1])/parts.length,
                [Config.primaryScore.name]: parts[0],
                [Config.secondaryScore.name]: parts[1],
            }
        }
    };
    //globalThis.matchScore = matchScore;
    let leave = $state(false);
    let charged = $state(false);
    let primaryScore = $state({
        amount: 0,
        points: 0,
    });
    let secondaryScore = $state({
        amount: 0,
        points: 0,
    });
    let endGoal = $state(false);
    let secondaryEndGoal = $state(false);
    let red = $state($allianceStore === "red");
    let alliance = $derived<Match["alliance"]>(red ? "red" : "blue");
    $effect(()=>{
        $currentMatch.scout = $scouter;
        $currentMatch.alliance = alliance;
        $currentMatch.assists = assists;
        $allianceStore = alliance;
    });
    let undoAvailable = $state(false);
    let redoAvailable = $state(false);
    let assists = $state(0);
    $effect(()=>{
        score;
        matchScore.overall = score.overall;
        matchScore.auto.score = score.auto;
        matchScore.auto.leave = leave;
        matchScore[part][Config.primaryScore.name] = $state.snapshot(primaryScore);
        matchScore[part][Config.secondaryScore.name] = $state.snapshot(secondaryScore);
        matchScore.teleop[Config.endGoal.name] = endGoal;
        matchScore.teleop[Config.secondaryEndGoal.name] = secondaryEndGoal;
        matchScore.teleop.score = score.teleop;
        $currentMatch.score = matchScore;
        ({undoAvailable,redoAvailable} = Config);
    });
    let timer = $state<Timer<any>|null>();
    let gameState = $derived.by<"pre"|"auto"|"teleop"|"post">(()=>{
        if(timer instanceof Timer){
            if(timer.time <= 0) return "post";
            let [minutes,seconds] = timer.formatted.split(":").map(Number);
            let time = minutes*60+seconds;
            if(time <= 2*60+15){
                return "teleop";
            }
            return "auto";
        }else{
            return "pre";
        }
    });
    let part = $derived<"auto"|"teleop">(gameState === "teleop" ? "teleop" : "auto");
    function start(){
        $currentMatch.date = Date.now();
        timer = new Timer("0:30");
        timer.start();
        timer.on("finish",()=>{
            let m = $matches.matches;
            m.push({...$currentMatch!});
            $matches = {matches:m};
            $scoutState = 0;
            timer = null;
            Config.reset();
            $currentMatch = {
                team: 0,
                match: $currentMatch.match+1,
                alliance: "red",
                scout: $scouter,
                date: 0,
                score: {
                    overall: 0,
                    auto: {
                        score: 0,
                        leave: false,
                        [Config.primaryScore.name]: {
                            amount: 0,
                            points: 0,
                        },
                        [Config.secondaryScore.name]: {
                            amount: 0,
                            points: 0,
                        },
                    },
                    teleop: {
                        score: 0,
                        [Config.endGoal.name]: false,
                        [Config.secondaryEndGoal.name]: false,
                        [Config.primaryScore.name]: {
                            amount: 0,
                            points: 0
                        },
                        [Config.secondaryScore.name]: {
                            amount: 0,
                            points: 0
                        },
                    },
                    accuracy: {
                        overall: 0,
                        [Config.primaryScore.name]: 0,
                        [Config.secondaryScore.name]: 0,
                    }
                },
                assists: 0,
            }
        })
    }
    function scorePrimary(){
        ({points:score[part],charged,leave,endGoal,secondaryEndGoal,secondaryScore,primaryScore,assists} = Config.primaryScore.score(Config?.primaryScore?.[part].points));
    }
    function scoreSecondary(){
        ({points:score[part],charged,leave,endGoal,secondaryEndGoal,secondaryScore,primaryScore,assists} = Config.secondaryScore.score(Config?.secondaryScore?.[part].points));
    }
    function updateScore(fn:()=>({points:number,charged:boolean,leave:boolean,endGoal:boolean,secondaryEndGoal:boolean,secondaryScore:{amount:number,points:number},primaryScore:{amount:number,points:number},assists:number})){
        ({points:score[part],charged,leave,endGoal,secondaryEndGoal,secondaryScore,primaryScore,assists}=fn());
    }
    type ScoreType = [typeof Config.primaryScore.name,typeof Config.secondaryScore.name][number];
    function miss(type:ScoreType){
        misses[type]++;
    }
</script>
<svelte:head>
    <title>Scouting - ScoutClient2025</title>
</svelte:head>
<main class="text-center">
    {#if $scoutState === 0}
    <main out:slide>
        <h1 class="text-2xl">Scout</h1>
        <br>
        <Input label="Scouter Name" bind:value={$scouter} /><br>
        <Input label="Match Number" type="number" bind:value={$currentMatch.match as unknown as string} /><br>
        <Input label="Team Number" type="number" bind:value={$currentMatch.team as unknown as string}/><br>
        <span class="text-lg">Alliance</span>
        <span class="space-x-0">
            <Button class="bg-[red] rounded-r-none {red ? "border border-white" : ""}" onclick={()=>red=true}>Red</Button><Button class="bg-[blue] rounded-l-none {red ? "" : "border border-white"}" onclick={()=>red=false}>Blue</Button>
        </span>
        <br><br>
        <Button class="bg-specialgreen" onclick={()=>$scoutState=1}>Ready</Button>
    </main>
    {:else if $scoutState === 1}
    <main in:slide out:slide>
        {#if gameState === "pre"}
            <Button onclick={start} class="bg-specialred">Start Game</Button>
        {:else}
            <h1 class="text-2xl border border-white inline p-0.1 rounded">
                &nbsp;{timer?.formatted??""}&nbsp;{uppercase(gameState)} | Score: {score.overall}&nbsp;
            </h1>
            <br>
            <Button disabled={undoAvailable} onclick={()=>{updateScore(Config.undo)}}>Undo</Button>&nbsp;<Button disabled={redoAvailable} onclick={()=>{updateScore(Config.redo)}}>Redo</Button><br>
            <Button onclick={scorePrimary}>{uppercase(Config.primaryScore.name)} Score</Button>&nbsp;
            <Button onclick={scoreSecondary}>{uppercase(Config.secondaryScore.name)} Score</Button><br>
            <Button onclick={()=>miss(Config.primaryScore.name)}>Miss {uppercase(Config.primaryScore.name)}</Button>&nbsp;
            <Button onclick={()=>miss(Config.secondaryScore.name)}>Miss {uppercase(Config.secondaryScore.name)}</Button><br>
            <Button onclick={()=>updateScore(Config.assist)}>Assist</Button>
            {#if gameState === "auto"}
                <Button disabled={leave} onclick={()=>{updateScore(Config.leave.score.bind(null,Config.leave.points))}}>Leave</Button><br>
            {:else}
            <br><Button disabled={endGoal} onclick={()=>{updateScore(Config.endGoal.score.bind(null,Config.endGoal.points))}}>{uppercase(Config.endGoal.name)}</Button>&nbsp;
                <Button disabled={secondaryEndGoal} onclick={()=>{updateScore(Config.secondaryEndGoal.score.bind(null,Config.secondaryEndGoal.points))}}>{uppercase(Config.secondaryEndGoal.name)}</Button><br>
            {/if}
        {/if}
    </main>
    {/if}
</main>