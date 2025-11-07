<script lang="ts">
    import Timer, { init } from '$lib/Timer.svelte';
    import Config from '$lib/config';
    Config.reset();
    import {
        scouter,
        matches,
        current_match,
        alliance as alliance_score,
        scout_state,
        started_current_match
    } from '$lib/stores';
    import { slide } from 'svelte/transition';
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import { uppercase, coerce, split_scoring, pretty } from '$lib';
    import { onMount } from 'svelte';
    import { DEV } from 'esm-env';
    import { createDialog } from 'svelte-headlessui';
    // @ts-ignore
    import Transition from 'svelte-transition';
    import { onDestroy } from 'svelte';
    import Match from '$lib/Match.svelte';
    let state_confirm = $state<boolean | null>();
    const intervals = $state<(number | NodeJS.Timeout)[]>([]);
    onDestroy(() => {
        for (const interval of intervals) clearInterval(interval);
    });
    async function confirm(): Promise<boolean> {
        state_confirm = null;
        dialog.open();
        const actual = new Promise(resolve => {
            const interval = setInterval(() => {
                if (state_confirm !== null) {
                    dialog.close();
                    clearInterval(interval);
                    intervals.splice(intervals.indexOf(interval), 1);
                    resolve(state_confirm!);
                }
            });
            intervals.push(coerce<number>(interval));
        }) as Promise<boolean>;
        return actual;
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
    const button_class = 'py-2xl h-20 w-40';
    let scoring_stuff: Array<{ amount: number; points: number }> = $state(Array(Config.scoring.length).fill({ amount: 0, points: 0 }));
    let ending_stuff: any[] = $state(Array(Config.end.length).fill(false));
    scouter; // used to shut up intellisense
    let score = $derived($current_match.score.concise);
    onMount(() => {
        init();
    });
    let timer = $state<Timer<any> | null>();
    if ($started_current_match || $scout_state! > 0) {
        reset();
    }
    const scoring_names = Config.scoring.map(({ name }) => name);
    let score_names = split_scoring(scoring_names);
    // warning ts gets very angry here, `coerce` comes in handy
    let misses = Object.fromEntries(Config.scoring.map((score: any) => [score.name, 0]));
    let match_score = $derived($current_match.score);
    let leave = $state(false);
    let end = $state(Object.fromEntries(Config.end.map(({ name }) => [name, false])));
    let red = $state($alliance_score === 'red');
    let alliance = $derived<Match['alliance']>(red ? 'red' : 'blue');
    $effect(() => {
        $current_match.scout = $scouter;
        $current_match.alliance = alliance;
        $current_match.assists = assists;
        $alliance_score = alliance;
    });
    let undo_available = $state(false);
    let redo_available = $state(false);
    let assists = $state(0);
    $inspect(scoring_stuff);
    $effect(() => {
        $current_match.notes = notes;
        for (let index = 0; index < Config.scoring.length; index++) {
            match_score[part][
                Config.scoring[index].name as keyof InstanceType<(typeof Match)['Scoring']>[
                    | 'auto'
                    | 'teleop']
            ] = $state.snapshot(scoring_stuff[index]);
        }
        for (let index = 0; index < Config.end.length; index++) {
            match_score.teleop[
                Config.end[index].name as keyof InstanceType<(typeof Match)['Scoring']>['teleop']
            ] = $state.snapshot(ending_stuff[index]);
        }
        ({ undo_available, redo_available } = Config);
    });
    // $inspect(match_score);
    let game_state = $state<'pre' | 'auto' | 'teleop' | 'post'>('pre');
    $inspect($current_match);
    $inspect(ending_stuff);
    let wake_lock: WakeLockSentinel | null = null;
    let part = $derived<'auto' | 'teleop'>(game_state === 'teleop' ? 'teleop' : 'auto');
    async function start() {
        if ('wakeLock' in navigator) {
            try {
                wake_lock = await navigator.wakeLock.request('screen');
            } catch {}
        }
        $current_match.date = Date.now();
        timer = new Timer(DEV ? '0:30' : '2:30');
        timer.start();
        $started_current_match = true;
        game_state = 'auto';
        timer.on('2:15', () => {
            timer!.pause();
            setTimeout(() => {
                timer!.play();
                game_state = 'teleop';
            }, 3000);
        });
        timer.on('finish', () => {
            game_state = 'post';
        });
    }
    function reset() {
        $scout_state = 0;
        timer = null;
        Config.reset();
        $current_match = new Match($scouter, 0, $current_match.match + 1, 'red');
        $started_current_match = false;
        game_state = 'pre';
        score;
        end = Object.fromEntries(Config.end.map(({ name }) => [name, false]));
        ending_stuff = Array(Config.end.length).fill(false);
        scoring_stuff = Array(Config.scoring.length).fill({ amount: 0, points: 0 });
        misses = Object.fromEntries(Config.scoring.map((score: any) => [score.name, 0]));
        leave = false;
        notes = '';
        score_bindings = Array(Config.scoring.length + 1).fill(undefined);
    }
    function finish() {
        const m = $matches.matches;
        m.push($current_match.clone());
        $matches = { matches: m };
        reset();
        wake_lock?.release?.()?.then?.(() => {
            wake_lock = null;
        });
    }
    function set_stuff_i_really_dont_wanna_deal_with_right_now_insert_name_here(
        state: Record<string, any>
    ) {
        let scoring;
        let end;
        ({
            points: score[part],
            leave: $current_match.score.auto.leave,
            end,
            scoring,
            assists
        } = state);
        for (let index = 0; index < Config.scoring.length; index++) {
            scoring_stuff[index] = scoring[Config.scoring[index].name];
        }
        for (let index = 0; index < Config.end.length; index++) {
            ending_stuff[index] = end[Config.end[index].name];
        }
    }
    function score_score<
        N extends keyof (typeof Config)[T],
        T extends 'scoring' | 'end' | 'leave' = 'scoring'
    >(index: N, type?: T) {
        if (type === 'leave') {
            return function () {
                const state = Config.leave.score(Config.leave.points);
                set_stuff_i_really_dont_wanna_deal_with_right_now_insert_name_here(state);
                return state;
            };
        }
        type ??= 'scoring' as T;
        return function () {
            let thing = Config[type][index];
            if (type === 'scoring') thing = thing[part as keyof unknown];
            const state = coerce<(...args: any[]) => Record<string, any>>(
                coerce<Record<string, (...args: any[]) => any>>(Config[type][index]).score
            )(coerce<Record<string, any>>(thing).points);
            set_stuff_i_really_dont_wanna_deal_with_right_now_insert_name_here(state);
            return state;
        };
    }
    function update_score(fn: () => Record<string, any>) {
        set_stuff_i_really_dont_wanna_deal_with_right_now_insert_name_here(fn());
    }
    function miss(type: string) {
        misses[type]++;
    }
    let score_bindings = $state<Array<number | undefined>>(
        Array(Config.scoring.length + 1).fill(undefined)
    );
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
                // @ts-ignore this has wasted 30 minutes of my life
                object[key] = (1 * coerce<number>((v + '').replace(/^\0+/, ''))) as number;
                if (object[key] !== object[key]) {
                    (object[key] as unknown as number) = 0;
                }
            }
        ];
    }
    function create_end_handler(index: keyof typeof Config.end): () => void {
        const updater = score_score(index, 'end');
        return function () {
            const state = updater() as { end: Record<string, boolean>; points: number };
            for (const end of Config.end) {
                if (Config.end[index] === end) continue;
                if (state.end[end.name] === false) continue;
                state.points -= end.points;
                state.end[end.name] = false;
            }
            set_stuff_i_really_dont_wanna_deal_with_right_now_insert_name_here(state);
        };
    }
    const [team, set_team] = create_number_binding($current_match, 'team');
    const [match, set_match] = create_number_binding($current_match, 'match');
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
                                        state_confirm = true;
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
    {#if $scout_state === 0}
        <main out:slide>
            <h1 class="text-2xl">Scout</h1>
            <br />
            <Input label="Scouter Name" bind:value={$scouter} /><br />
            <Input
                label="Match Number"
                type="number"
                bind:value={() => match(), v => set_match(v)}
            /><br />
            <Input
                label="Team Number"
                type="number"
                bind:value={() => team(), v => set_team(v)}
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
                    if ($current_match.team === 0) {
                        await alert({
                            label: 'Invalid Team',
                            header: 'Invalid Team',
                            text: 'Please enter a valid team number.'
                        });
                    } else {
                        $scout_state = 1;
                    }
                }}>Ready</Button
            >
        </main>
    {:else if $scout_state === 1}
        <main in:slide out:slide>
            {#if game_state === 'pre'}
                <Button onclick={start} class="bg-specialred">Start Game</Button>
            {:else}
                <h1 class="text-2xl border border-white inline p-0.1 rounded">
                    &nbsp;{timer?.formatted ?? ''}&nbsp;{uppercase(game_state)} | Score: {score.overall}&nbsp;
                </h1>
                <br /><br />
                <Button
                    disabled={undo_available}
                    class={button_class}
                    onclick={() => {
                        update_score(Config.undo);
                    }}>Undo</Button
                >&nbsp;<Button
                    disabled={redo_available}
                    class={button_class}
                    onclick={() => {
                        update_score(Config.redo);
                    }}>Redo</Button
                ><br /><br />
                {#each Object.entries(score_names) as [name, subsets], i}
                    {#if subsets.length === 1}
                        <Button onclick={score_score(subsets[0].index)}
                            >{pretty(name + '(' + subsets[0].name + ')')} Score</Button
                        >
                    {:else}
                        <Button
                            onclick={function (e) {
                                e.target === this ? score_score(score_bindings[i]!)() : null;
                            }}
                        >
                            {pretty(name)}
                            {'('}<select
                                bind:value={
                                    () => (score_bindings[i] ??= subsets[0].index),
                                    v => (score_bindings[i] = v)
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

                {@const last = score_bindings.length - 1}
                {#each Object.entries(score_names) as [name, subsets], i}
                    <Button
                        class={button_class}
                        onclick={function (e) {
                            if (e.target === this) miss(scoring_names[score_bindings.at(-1)!]);
                        }}
                    >
                        Miss {pretty(name)}
                        <select
                            class="override-select"
                            style="width: 100%"
                            bind:value={
                                () => (score_bindings[i] ??= subsets[0].index),
                                v => (score_bindings[i] = v)
                            }
                        >
                            {#each subsets as { name, index }}
                                <option value={index}>{pretty(name)}</option>
                            {/each}
                        </select>
                    </Button>
                {/each}
                <Button
                    onclick={() => update_score(Config.assist)}
                    class={button_class}>Assist</Button
                >
                {#if game_state === 'auto'}
                    <Button
                        disabled={leave}
                        onclick={score_score('points', 'leave')}
                        class={button_class}>Leave</Button
                    >
                {:else}
                    {#each ending_stuff, i}
                        <Button
                            disabled={ending_stuff[i]}
                            onclick={create_end_handler(i)}
                            class={button_class}>{uppercase(Config.end[i].name)}</Button
                        >
                        {#if i % 2}
                            <br /><br />
                        {/if}
                    {/each}
                {/if}
                {#if game_state === 'post'}
                    <Button onclick={finish} class={button_class}><b>Next Game</b></Button>
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
