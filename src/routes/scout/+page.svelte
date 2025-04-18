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
        scoutState,
        started_current_match
    } from '$lib/stores';
    import { fade, slide } from 'svelte/transition';
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import { uppercase, coerce, splitScoring, pretty } from '$lib';
    import { onMount } from 'svelte';
    import { DEV } from 'esm-env';
    import { createDialog } from 'svelte-headlessui';
    //@ts-ignore
     import Transition from 'svelte-transition';
     import { onDestroy } from 'svelte';
     let stateConfirm = $state<boolean | null>();
     let intervals = $state<(number | NodeJS.Timeout)[]>([]);
     onDestroy(() => {
         for (let interval of intervals) clearInterval(interval);
     });
     async function confirm(): Promise<boolean> {
         stateConfirm = null;
         dialog.open();
         let actual = new Promise((resolve, reject) => {
             let interval = setInterval(() => {
                 if (stateConfirm !== null) {
                     dialog.close();
                     clearInterval(interval);
                     intervals.splice(intervals.indexOf(interval), 1);
                     resolve(stateConfirm as boolean);
                 }
             });
             intervals.push(coerce<number>(interval));
         }) as Promise<boolean>;
         return actual; //Promise.race([timeout,actual])
     }
     let dialog_label = $state('');
     let dialog_text = $state('');
     let dialog_header = $state('');
     let dialog = $derived(createDialog({ label: dialog_label }));
     async function alert({ label, text, header }: { label: string; text: string; header: string }) {
         dialog_label = label;
         dialog_text = text;
         dialog_header = header;
         await confirm();
     }
    let sans = $derived($scouter.toLowerCase() === 'sans');
    //globalThis.Button = Button;
    let papyrus = $derived($scouter.toLowerCase() === 'papyrus');
    let buttonClass = 'py-2xl h-20 w-40';
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
    let timer = $state<Timer<any> | null>();
    if ($started_current_match || $scoutState! > 0) {
        reset();
    }
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
            // console.log(matchScore);
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
    let wakeLock: WakeLockSentinel | null = null;
    let part = $derived<'auto' | 'teleop'>(gameState === 'teleop' ? 'teleop' : 'auto');
    async function start() {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
            } catch (err) {

            }
        }
        $currentMatch.date = Date.now();
        timer = new Timer(DEV ? '0:30' : '2:30');
        timer.start();
        $started_current_match = true;
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
        });
    }
    function reset() {
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
        $started_current_match = false;
        gameState = 'pre';
        score = {
            auto: 0,
            teleop: 0,
            overall: 0
        };
        end = Object.fromEntries(Config.end.map(({ name }) => [name, false]));
        endingStuff = Array(Config.end.length).fill(false);
        scoringStuff = Array(Config.scoring.length).fill({ amount: 0, points: 0 });
        matchScore = {
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
                            coerce<() => any>((score: Record<string, string>) => [
                                score.name,
                                false
                            ])
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
                let fulls = Config.scoring.map(
                    (score) => this.auto[score.name].amount + this.teleop[score.name].amount
                );
                let amounts = Config.scoring
                    .map((score) => score.name)
                    .map((name, index) => misses[name] + fulls[index]);
                let parts = fulls.map((f, i) => f / amounts[i]).map((n) => (n !== n ? 1 : n));
                return {
                    overall: parts.reduce((a, b) => a + b, 0) / parts.length,
                    ...Object.fromEntries(
                        Config.scoring.map((score) => score.name).map((s, i) => [s, parts[i]])
                    )
                };
            }
        };
        misses = Object.fromEntries(Config.scoring.map((score: any) => [score.name, 0]));
        leave = false;
        notes = '';
        scoreBindings = Array(Config.scoring.length + 1).fill(undefined);
    }
    function finish() {
        let m = $matches.matches;
        m.push({ ...$currentMatch });
        $matches = { matches: m };
        reset();
        wakeLock?.release?.()?.then?.(() => {
            wakeLock = null;
        });
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
        // console.log({ endingStuff, scoringStuff });
    }
    function scoreScore<
        N extends keyof (typeof Config)[T],
        T extends 'scoring' | 'end' | 'leave' = 'scoring'
    >(index: N, type?: T) {
        if (type === 'leave') {
            return function () {
                let state = Config.leave.score(Config.leave.points);
                setStuffIReallyDontWannaDealWithRightNowInsertNameHere(state);
                return state;
            };
        }
        type ??= 'scoring' as T;
        return function () {
            let thing = Config[type][index];
            if (type === 'scoring') thing = thing[part as keyof unknown];
            let state = coerce<(...args: any[]) => Record<string, any>>(
                coerce<Record<string, (...args: any[]) => any>>(Config[type][index]).score
            )(coerce<Record<string, any>>(thing).points);
            setStuffIReallyDontWannaDealWithRightNowInsertNameHere(state);
            return state;
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
    function create_number_binding<K extends string, T extends Required<Record<K, number>>>(
        object: T,
        key: K
    ): [() => string, (next: number | string) => void] {
        return [
            () => {
                return object[key].toString();
            },
            (v: number | string) => {
                //@ts-ignore this has wasted 30 minutes of my life
                object[key] = (1 * coerce<number>((v + '').replace(/^\0+/, ''))) as number;
                if (object[key] !== object[key]) {
                    (object[key] as unknown as number) = 0;
                }
            }
        ];
    }
    function create_end_handler(index: keyof typeof Config.end): () => void {
        let updater = scoreScore(index, 'end');
        return function () {
            let state = updater() as Record<string, number | Record<string, any>>;
            for (let end of Config.end) {
                if (Config.end[index] === end) continue;
                if ((state['end' as keyof typeof state] as Record<string, any>)[end.name] === false)
                    continue;
                (state['points' as keyof typeof state] as number) -= end.points;
                (state['end' as keyof typeof state] as Record<string, any>)[end.name] = false;
            }
            setStuffIReallyDontWannaDealWithRightNowInsertNameHere(state);
        };
    }
    let [team, setTeam] = create_number_binding($currentMatch, 'team');
    let [match, setMatch] = create_number_binding($currentMatch, 'match');
</script>

<svelte:head>
    <title>Scouting - ScoutClient2025</title>
</svelte:head>
<main class={{ 'text-center': true, sans, papyrus }}>
    <div class="relative z-10">
        <Transition show={$dialog.expanded}>
            <Transition
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Button class="fixed inset-0 bg-black bg-opacity-25" onclick={dialog.close} />
            </Transition>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-950 shadow-[0_0_2px_white] p-6 text-left align-middle shadow-xl transition-all"
                            use:dialog.modal
                        >
                            <h3 class="text-lg font-medium leading-6 text-white">
                                {dialog_header}
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-grey-900">
                                    {dialog_text}
                                </p>
                            </div>

                            <div class="mt-4">
                                <Button
                                    onclick={() => {
                                        stateConfirm = true;
                                    }}
                                >
                                    OK
                                </Button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </div>
    {#if $scoutState === 0}
        <main out:slide>
            <h1 class="text-2xl">Scout</h1>
            <br />
            <Input label="Scouter Name" bind:value={$scouter} /><br />
            <Input
                label="Match Number"
                type="number"
                bind:value={() => match(), (v) => setMatch(v)}
            /><br />
            <Input
                label="Team Number"
                type="number"
                bind:value={() => team(), (v) => setTeam(v)}
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
            <Button
                 class="bg-specialgreen"
                 onclick={async () => {
                     if ($currentMatch.team === 0) {
                         await alert({
                             label: 'Invalid Team',
                             header: 'Invalid Team',
                             text: 'Please enter a valid team number.'
                         });
                     } else {
                        $scoutState = 1;
                     }
                 }}>Ready</Button
             >
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
                    {#each endingStuff, i}
                        <Button
                            disabled={endingStuff[i]}
                            onclick={create_end_handler(i)}
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
