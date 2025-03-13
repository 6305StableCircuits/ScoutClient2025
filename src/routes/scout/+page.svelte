<script lang="ts">
    import type { Match } from '$lib/types';
    import Timer, { init } from '$lib/timer.svelte';
    import Config from '$lib/config';
    Config.reset();
    import {
        scouter,
        matches,
        currentMatch,
        alliance as allianceStore,
        scoutState
    } from '$lib/stores';
    import { fade, slide } from 'svelte/transition';
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import { uppercase, coerce, splitScoring, pretty } from '$lib';
    import { onMount } from 'svelte';
    let sans = $derived($scouter.toLowerCase() === 'sans');
    //globalThis.Button = Button;
    let papyrus = $derived($scouter.toLowerCase() === 'papyrus');
    let buttonClass = $state('py-2xl h-20 w-40');
    //@ts-ignore
    let scoringStuff: any[] = $state(Array(Config.scoring.length).fill({ amount: 0, points: 0 }));
    //@ts-ignore
    let endingStuff: any[] = $state(Array(Config.end.length).fill(false));
    scouter; //used to shut up intellisense
    let score = $state({
        auto: 0,
        teleop: 0,
        overall: 0
    });
    $effect(() => {
        score.overall = score.auto + score.teleop;
    });
    onMount(() => {
        init();
    });
    let scoreNames = splitScoring(Config.scoring.map(({ name }) => name));
    const scoringNames = Config.scoring.map(({ name }) => name);
    // warning ts gets very angry here, `coerce` comes in handy
    let misses = Object.fromEntries(Config.scoring.map((score: any) => [score.name, 0]));
    let matchScore: Record<string, any> = {
        overall: 0,
        auto: {
            score: 0,
            leave: false,
            ...Object.fromEntries(
                coerce<[string, Record<string, any>][]>(
                    Config.scoring.map(
                        coerce<() => any>((score: Record<string, string>) => [
                            score.name,
                            {
                                amount: 0,
                                points: 0
                            }
                        ])
                    )
                )
            )
        },
        teleop: {
            score: 0,
            ...Object.fromEntries(
                coerce<[string, boolean][]>(
                    Config.end.map(
                        coerce<() => any>((score: Record<string, string>) => [score.name, false])
                    )
                )
            ),
            ...Object.fromEntries(
                coerce<[string, Record<string, any>][]>(
                    Config.scoring.map(
                        coerce<() => any>((score: Record<string, string>) => [
                            score.name,
                            {
                                amount: 0,
                                points: 0
                            }
                        ])
                    )
                )
            )
        },
        get accuracy() {
            // let fulls = [
            //     matchScore.auto[Config.primaryScore.name].amount+matchScore.teleop[Config.primaryScore.name].amount,
            //     matchScore.teleop[Config.secondaryScore.name].amount+matchScore.auto[Config.secondaryScore.name].amount
            // ];
            console.log(matchScore);
            let fulls = Config.scoring.map(
                (score) => this.auto[score.name].amount + this.teleop[score.name].amount
            );
            // console.log(fulls);
            let amounts = Config.scoring
                .map((score) => score.name)
                .map((name, index) => misses[name] + fulls[index]);
            // console.log(amounts);
            let parts = fulls.map((f, i) => f / amounts[i]).map((n) => (n !== n ? 1 : n));
            // console.log(parts);
            return {
                overall: parts.reduce((a, b) => a + b, 0) / parts.length,
                ...Object.fromEntries(
                    Config.scoring.map((score) => score.name).map((s, i) => [s, parts[i]])
                )
            };
        }
    };
    //globalThis.matchScore = matchScore;
    let leave = $state(false);
    let end = $state(Object.fromEntries(Config.end.map(({ name }) => [name, false])));
    let red = $state($allianceStore === 'red');
    let alliance = $derived<Match['alliance']>(red ? 'red' : 'blue');
    $effect(() => {
        $currentMatch.scout = $scouter;
        $currentMatch.alliance = alliance;
        $currentMatch.assists = assists;
        $allianceStore = alliance;
    });
    let undoAvailable = $state(false);
    let redoAvailable = $state(false);
    let assists = $state(0);
    $inspect(scoringStuff);
    $effect(() => {
        let names = Config.scoring.map(({ name }) => name);
        score;
        matchScore.overall = score.overall;
        matchScore.auto.score = score.auto;
        matchScore.auto.leave = leave;
        $currentMatch.notes = notes;
        for (let index = 0; index < Config.scoring.length; index++) {
            //@ts-ignore
            matchScore[part][Config.scoring[index].name] = $state.snapshot(scoringStuff[index]);
        }
        for (let index = 0; index < Config.end.length; index++) {
            //@ts-ignore
            matchScore.teleop[Config.end[index].name] = $state.snapshot(endingStuff[index]);
        }
        matchScore.teleop.score = score.teleop;
        ($currentMatch as Record<string, any>).score = matchScore;
        ({ undoAvailable, redoAvailable } = Config);
    });
    $inspect(matchScore);
    let timer = $state<Timer<any> | null>();
    // let paused_for_auto = $state(false);
    // internals.state
    // let gameState = $derived.by<'pre' | 'auto' | 'teleop' | 'post'>(() => {
    //     if (timer instanceof Timer) {
    //         if (timer.time <= 0) return 'post';
    //         let [minutes, seconds] = timer.formatted.split(':').map(Number);
    //         let time = minutes * 60 + seconds;
    //         if (paused_for_auto) return 'auto';
    //         if (time <= 2 * 60 + 15) {
    //             return 'teleop';
    //         }
    //         return 'auto';
    //     } else {
    //         return 'pre';
    //     }
    // });
    let gameState = $state<'pre' | 'auto' | 'teleop' | 'post'>('pre');
    $inspect($currentMatch);
    $inspect(endingStuff);
    let part = $derived<'auto' | 'teleop'>(gameState === 'teleop' ? 'teleop' : 'auto');
    function start() {
        $currentMatch.date = Date.now();
        timer = new Timer('2:30');
        timer.start();
        gameState = 'auto';
        timer.on('2:15', () => {
            timer!.pause();
            setTimeout(() => {
                timer!.play();
                gameState = 'teleop';
            }, 3000);
        });
        timer.on('finish', () => {
            gameState = 'post';
        })
    }
    function finish() {
        let m = $matches.matches;
        m.push({ ...$currentMatch });
        $matches = { matches: m };
        $scoutState = 0;
        timer = null;
        Config.reset();
        $currentMatch = {
            team: 0,
            match: $currentMatch.match + 1,
            alliance: 'red',
            scout: $scouter,
            date: 0,
            notes: '',
            score: {
                overall: 0,
                auto: {
                    score: 0,
                    leave: false,
                    ...scoringStuff.reduce(
                        (a, b, index) => ({
                            ...a,
                            [Config.scoring[index].name]: {
                                amount: 0,
                                points: 0
                            }
                        }),
                        {}
                    )
                },
                teleop: {
                    score: 0,
                    ...endingStuff.reduce(
                        (a, b, index) => ({
                            ...a,
                            [Config.end[index].name]: false
                        }),
                        {}
                    ),
                    ...scoringStuff.reduce(
                        (a, b, index) => ({
                            ...a,
                            [Config.scoring[index].name]: {
                                amount: 0,
                                points: 0
                            }
                        }),
                        {}
                    )
                },
                accuracy: {
                    overall: 0,
                    ...scoringStuff.reduce(
                        (a, b, index) => ({
                            ...a,
                            [Config.scoring[index].name]: {
                                amount: 0,
                                points: 0
                            }
                        }),
                        {}
                    )
                }
            },
            assists: 0
        };
    }
    // function scorePrimary(){
    //     ({points:score[part],charged,leave,endGoal,secondaryEndGoal,secondaryScore,primaryScore,assists} = Config.primaryScore.score(Config?.primaryScore?.[part].points));
    // }
    // function scoreSecondary(){
    //     ({points:score[part],charged,leave,endGoal,secondaryEndGoal,secondaryScore,primaryScore,assists} = Config.secondaryScore.score(Config?.secondaryScore?.[part].points));
    // }
    // function scoreFn<N extends typeof Config["scoring"][number]["name"]>(name: N) {
    //     let scorePart = score[part][Config.scoring.findIndex(({name: n})=>n === name)];
    //      ({points: score[part], } = scoreFn(name));
    // }
    function setStuffIReallyDontWannaDealWithRightNowInsertNameHere(state: Record<string, any>) {
        // console.log(state);
        let scoring;
        let end;
        ({ points: score[part], leave, end, scoring, assists } = state);
        for (let index = 0; index < Config.scoring.length; index++) {
            scoringStuff[index] = scoring[Config.scoring[index].name];
        }
        for (let index = 0; index < Config.end.length; index++) {
            endingStuff[index] = end[Config.end[index].name];
        }
        console.log({ endingStuff, scoringStuff });
    }
    function scoreScore<
        N extends keyof (typeof Config)[T],
        T extends 'scoring' | 'end' | 'leave' = 'scoring'
    >(index: N, type?: T) {
        if (type === 'leave') {
            return function () {
                setStuffIReallyDontWannaDealWithRightNowInsertNameHere(
                    Config.leave.score(Config.leave.points)
                );
            };
        }
        type ??= 'scoring' as T;
        return function () {
            let thing = Config[type][index];
            if (type === 'scoring') thing = thing[part as keyof unknown];
            setStuffIReallyDontWannaDealWithRightNowInsertNameHere(
                coerce<(...args: any[]) => any>(
                    coerce<Record<string, (...args: any[]) => any>>(Config[type][index]).score
                )(coerce<Record<string, any>>(thing).points)
            );
        };
    }
    function updateScore(fn: () => Record<string, any>) {
        setStuffIReallyDontWannaDealWithRightNowInsertNameHere(fn());
    }
    type ScoreType = [(typeof Config.scoring)[number]['name']][number];
    function miss(type: ScoreType) {
        misses[type]++;
    }
    let scoreBindings = $state(Array(Config.scoring.length + 1).fill(undefined));
    let notes = $state('');
</script>

<svelte:head>
    <title>Scouting - ScoutClient2025</title>
</svelte:head>
<main class="text-center" class:sans class:papyrus>
    {#if $scoutState === 0}
        <main out:slide>
            <h1 class="text-2xl">Scout</h1>
            <br />
            <Input label="Scouter Name" bind:value={$scouter} /><br />
            <Input
                label="Match Number"
                type="number"
                bind:value={$currentMatch.match as unknown as string}
            /><br />
            <Input
                label="Team Number"
                type="number"
                bind:value={$currentMatch.team as unknown as string}
            /><br />
            <span class="text-lg">Alliance</span>
            <span class="space-x-0">
                <Button
                    class="bg-[red] rounded-r-none {red ? 'border border-white' : ''}"
                    onclick={() => (red = true)}>Red</Button
                ><Button
                    class="bg-[blue] rounded-l-none {red ? '' : 'border border-white'}"
                    onclick={() => (red = false)}>Blue</Button
                >
            </span>
            <br /><br />
            <Button class="bg-specialgreen" onclick={() => ($scoutState = 1)}>Ready</Button>
        </main>
    {:else if $scoutState === 1}
        <main in:slide out:slide>
            {#if gameState === 'pre'}
                <Button onclick={start} class="bg-specialred">Start Game</Button>
            {:else}
                <h1 class="text-2xl border border-white inline p-0.1 rounded">
                    &nbsp;{timer?.formatted ?? ''}&nbsp;{uppercase(gameState)} | Score: {score.overall}&nbsp;
                </h1>
                <br /><br />
                <Button
                    disabled={undoAvailable}
                    class={buttonClass}
                    onclick={() => {
                        updateScore(coerce<() => any>(Config.undo));
                    }}>Undo</Button
                >&nbsp;<Button
                    disabled={redoAvailable}
                    class={buttonClass}
                    onclick={() => {
                        updateScore(Config.redo);
                    }}>Redo</Button
                ><br /><br />
                <!-- {#each Config.scoring as score, i}
                    <Button onclick={scoreScore(i)} class={buttonClass}
                        >{uppercase(score.name)} Score</Button
                    >&nbsp;
                {/each} -->
                {#each Object.entries(scoreNames) as [name, subsets], i}
                    {#if subsets.length === 1}
                        <Button onclick={scoreScore(subsets[0].index)}
                            >{pretty(name + '(' + subsets[0].name + ')')} Score</Button
                        >
                    {:else}
                        <Button
                            onclick={function (e) {
                                e.target === this ? scoreScore(scoreBindings[i])() : null;
                            }}
                        >
                            {pretty(name)}
                            {'('}<select
                                bind:value={
                                    () => (scoreBindings[i] ??= subsets[0].index),
                                    (v) => (scoreBindings[i] = v)
                                }
                                class="override-select px-0 mx-0"
                            >
                                {#each subsets as { name, index }}
                                    <option class="bg-[#135fef]" value={index}>{name}</option>
                                {/each}
                            </select>{')'} Score
                        </Button>
                    {/if}
                    <br /><br />
                {/each}

                {@const last = scoreBindings.length - 1}
                {#each Object.entries(scoreNames) as [name, subsets], i}
                    <Button
                        class={buttonClass}
                        onclick={function (e) {
                            if (e.target === this) miss(scoringNames[scoreBindings.at(-1)]);
                        }}
                    >
                        Miss {pretty(name)}
                        <select
                            class="override-select"
                            style="width: 100%"
                            bind:value={
                                () => (scoreBindings[i] ??= subsets[0].index),
                                (v) => (scoreBindings[i] = v)
                            }
                        >
                            {#each subsets as { name, index }}
                                <option value={index}>{pretty(name)}</option>
                            {/each}
                        </select>
                    </Button>
                {/each}
                <Button
                    onclick={() => updateScore(coerce<() => any>(Config.assist))}
                    class={buttonClass}>Assist</Button
                >
                {#if gameState === 'auto'}
                    <Button
                        disabled={leave}
                        onclick={scoreScore('points', 'leave')}
                        class={buttonClass}>Leave</Button
                    >
                {:else}
                    <!-- <br><br><Button disabled={endingStuff[0]} onclick={()=>{updateScore(coerce<()=>any>(Config.scoring[endingStuff[0]].score.bind(null,endingStuff[0])))}} class={buttonClass}>{uppercase(Config.scoring[endingStuff[0]].name)}</Button>&nbsp; -->
                    {#each endingStuff as end, i}
                        <Button
                            disabled={endingStuff[i]}
                            onclick={scoreScore(i, 'end')}
                            class={buttonClass}>{uppercase(Config.end[i].name)}</Button
                        >
                        {#if i % 2}
                            <br /><br />
                        {/if}
                    {/each}
                {/if}
                {#if gameState === 'post'}
                    <Button onclick={finish} class={buttonClass}><b>Next Game</b></Button>
                {/if}
                <h2>Notes</h2>
                <textarea
                    class="border-white rounded w-[80%] outline-none text-black p-2"
                    bind:value={notes}
                ></textarea>
            {/if}
        </main>
    {/if}
</main>

<style>
    .sans {
        font-family: 'Comic Sans MS', cursive;
    }
    .papyrus {
        font-family: 'Papyrus', 'Inter';
    }
</style>
