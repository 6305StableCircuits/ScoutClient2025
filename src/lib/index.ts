// place files you want to import through the `$lib` alias in this folder.
import { page } from '$app/state';
import type { Score } from '$lib/types';
import Config from '$lib/config';
import type Match from './Match.svelte';
export const noop = () => {};
export const paths = {
    home: '',
    scout: 'scout',
    'save data': 'save',
    'view data': 'data'
} as const;
export const path_entries = [
    ['home', '/'],
    ['scout', '/scout'],
    ['save data', '/save'],
    ['view data', '/data']
] as const;
/**
 * Formats a string from 'formatted string' to 'Formatted String'.
 */
export function uppercase(string: string): string {
    string ??= '';
    return string.replace(/(( |^)[a-z])/g, m => m.toUpperCase());
}

export function pretty(string: string): string {
    string ??= '';
    return uppercase(
        string.replace(/_/g, ' ').replace(/[a-z][A-Z]/g, m => m.charAt(0) + ' ' + m.charAt(1))
    );
}

export function is_current_path(path: string): boolean {
    let [p, c] = [
        path.replace(/(^\/)|(\/$)/g, ''),
        page?.url?.pathname?.replace?.(/(^\/)|(\/$)/g, '')
    ];
    return p === c;
}

/**
 * Coerces a value to the specified type.
 * @template T The type you want to coerce to
 * @param {any} value The value to be coerced
 * @returns {T}
 */
export function coerce<T>(value: any): T {
    return value as unknown as T;
}

export function rank(matches: Match[]): number[] {
    const teams = [...new Set(matches.map(match => match.team))];
    const scores = teams
        .map(team => ({
            [team]: get_average_score(matches.filter(match => match.team === team))
        }))
        .reduce((a, b) => Object.assign(a, b), {});
    const rankings = Object.entries(scores)
        .sort(([k, v], [k1, v1]) => v1.overall - v.overall)
        .map(([team, score]) => {
            return coerce<number>(team) * 1;
        });
    return rankings;
}

export function split_scoring(score_names: string[]) {
    const res: Record<string, { name: string; index: number }[]> = {};
    for (const name of score_names) {
        const main = name.split(' ')[0];
        const subset = pretty(name.replace(main + '', '').replace(/\((.*?)\)/, (_, m) => m));
        // console.log(subset);
        (res[main] ??= []).push({
            name: subset,
            index: score_names.indexOf(name)
        });
    }
    return res;
}

export function get_average_score(matches: Match[]): Score {
    // console.log(matches);
    let res = {
        overall: <any[]>[],
        auto: <Record<string, any>>{
            score: [],
            leave: [],
            ...Object.fromEntries(
                Config.scoring.map(({ name }) => [
                    name,
                    {
                        amount: [],
                        points: []
                    }
                ])
            )
        },
        teleop: <Record<string, any>>{
            score: [],
            ...Object.fromEntries(Config.end.map(({ name }) => [name, []])),
            ...Object.fromEntries(
                Config.scoring.map(({ name }) => [
                    name,
                    {
                        amount: [],
                        points: []
                    }
                ])
            )
        },
        accuracy: <Record<string, any>>{
            overall: Array<number>(),
            ...Object.fromEntries(Config.scoring.map(({ name }) => [name, []]))
        }
    };
    for (const { score } of matches) {
        res.overall.push(score.overall);
        res.auto.score.push(score.auto.score);
        res.auto.leave.push(score.auto.leave);
        for (let s of Config.scoring) {
            res.auto[coerce<Record<string, any>>(s).name].amount.push(
                score.auto[s.name as keyof InstanceType<(typeof Match)['Scoring']>['auto']].amount
            );
            res.auto[s.name].points.push(
                score.auto[s.name as keyof InstanceType<(typeof Match)['Scoring']>['auto']].points
            );
            res.teleop[s.name].amount.push(
                score.teleop[s.name as keyof InstanceType<(typeof Match)['Scoring']>['teleop']]
                    .amount
            );
            res.teleop[s.name].points.push(score.teleop[s.name].points);
            res.accuracy[s.name].push(score.accuracy[s.name]);
        }
        for (let end of Config.end) {
            res.teleop[end.name].push(score.teleop[end.name]);
        }
        res.teleop.score.push(score.teleop.score);
        res.accuracy.overall.push(score.accuracy.overall);
    }
    let avg: Score = {
        overall: average(res.overall),
        // @ts-expect-error
        auto: {
            score: average(res.auto.score),
            leave: average(res.auto.leave),
            ...Config.scoring
                .map(({ name }) => ({
                    amount: average(res.auto[name].amount),
                    points: average(res.auto[name].points)
                }))
                .reduce(
                    (a, b, index) => ({
                        ...a,
                        [Config.scoring[index].name]: b
                    }),
                    {}
                )
        },
        teleop: <Record<string & 'score', any>>{
            score: average(res.teleop.score),
            ...Object.fromEntries(Config.end.map(({ name }) => [name, average(res.teleop[name])])),
            ...Config.scoring
                .map(({ name }) => ({
                    amount: average(res.teleop[name].amount),
                    points: average(res.teleop[name].points)
                }))
                .reduce(
                    (a, b, index) => ({
                        ...a,
                        [Config.scoring[index].name]: b
                    }),
                    {}
                )
        },
        accuracy: {
            overall: average(res.accuracy.overall),
            ...Object.fromEntries(
                Config.scoring.map(({ name }) => [name, average(res.accuracy[name])])
            )
        }
    };
    return avg;
}
export function average<T extends boolean | number>(arr: T[]): T {
    const { length } = arr;
    switch (typeof arr[0]) {
        case 'boolean':
            //@ts-ignore
            return (
                deNaN(
                    arr.reduce((a, b) => {
                        return a + (b ? 1 : 0);
                    }, 0) / length
                ) >= 0.5
            );
        case 'number':
            //@ts-ignore
            return deNaN(arr.reduce((a, b) => a + b, 0) / length).toFixed(2);
    }
}
export function deNaN(value: number): number {
    return value !== value ? 0 : value;
}
export function split_parts<T>(arr: T[], amount: number): T[][] {
    const res: Array<T[]> = [];
    let part: T[] = [];
    for (const item of arr) {
        part.push(item);
        if (part.length === amount) {
            res.push(part);
            part = [];
        }
    }
    if (part.length > 0) {
        res.push(part);
        part = [];
    }
    return res;
}
export function choose_alliances(array: number[]): number[][] {
    const result = [];
    const arr = [...array];
    for (let i = 0; i < 8; i++) {
        if (arr.length !== 0) {
            const alliance = [arr.shift()];
            if (arr.length !== 0) {
                alliance.push(arr.shift());
            }
            result.push(coerce<number[]>(alliance));
        }
    }
    for (const alliance of result.toReversed()) {
        if (arr.length !== 0) alliance.push(arr.shift()!);
    }
    for (const alliance of result) {
        if (arr.length !== 0) alliance.push(arr.shift()!);
    }
    return coerce<number[][]>(result);
}
