import { writable, readable, get } from 'svelte/store';
import type { Match } from '$lib/types';
import { persisted } from 'svelte-persisted-store';
import Config from '$lib/config';
import { coerce } from '$lib';
export { get };
export const matches = persisted<{ matches: Match[] }>('matches', { matches: [] });
export const scouter = persisted('scouter', '', {
    serializer: {
        parse: (v: string) => v,
        stringify: (v: string) => v
    }
});
let scoutStateValue = 0;
let subscribers = Symbol('subscribers');
export const scoutState = {
    subscribe(fn: (v?: typeof scoutStateValue) => any) {
        fn(scoutStateValue);
        this[subscribers].add(fn);
        return () => {
            this[subscribers].delete(fn);
        };
    },
    [subscribers]: new Set<(v?: typeof scoutStateValue) => any>(),
    set(v: number) {
        if (v !== scoutStateValue) {
            scoutStateValue = v;
            [...this[subscribers]].forEach((s) => s(v));
        }
    }
};
export const alliance = persisted<Match['alliance']>('alliance', 'red');
type Settings = {
    mode: 'dark' | 'light';
    fish: boolean;
    scoutFont: 'default' | 'papyrus' | 'sans';
};
export const settings = persisted<Settings>('settings', {
    mode:
        (globalThis?.window?.matchMedia?.('prefers-color-scheme: dark') ?? true) ? 'dark' : 'light',
    fish: true,
    scoutFont: 'default'
});
export const currentMatch = writable<Match>({
    team: 0,
    match: 0,
    alliance: 'red',
    scout: get(scouter),
    date: 0,
    notes: '',
    score: {
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
                coerce<[string, Record<string, any>][]>(
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
        accuracy: {
            overall: 0,
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
        }
    },
    assists: 0
});
// if(typeof get(scouter) === "object"){
//     scouter.set("")
// }
