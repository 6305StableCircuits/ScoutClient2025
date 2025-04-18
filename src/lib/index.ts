// place files you want to import through the `$lib` alias in this folder.
import { page } from '$app/state';
import type { Match, Score } from '$lib/types';
import Config from '$lib/config';
export const noop = () => {};
export let paths = {
    home: '',
    scout: 'scout',
    'save data': 'save',
    'view data': 'data'
} as const;
export let pathEntries = [
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
    return string.replace(/(( |^)[a-z])/g, (m) => m.toUpperCase());
}
export function pretty(string: string): string {
    string ??= '';
    return uppercase(
        string.replace(/_/g, ' ').replace(/[a-z][A-Z]/g, (m) => m.charAt(0) + ' ' + m.charAt(1))
    );
}
export function isCurrentPath(path: string): boolean {
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
    let teams = [...new Set(matches.map((match) => match.team))];
    let scores = teams
        .map((team) => ({
            [team]: getAverageScore(matches.filter((match) => match.team === team))
        }))
        .reduce((a, b) => Object.assign(a, b), {});
    let rankings = Object.entries(scores)
        .sort(([k, v], [k1, v1]) => v1.overall - v.overall)
        .map(([team, score]) => {
            return coerce<number>(team) * 1;
        });
    return rankings;
}
type ScoreAmount = {
    amount: number[];
    points: number[];
};
export function splitScoring(scoreNames: string[]) {
    let res: Record<string, { name: string; index: number }[]> = {};
    for (let name of scoreNames) {
        let main = name.split(' ')[0];
        let subset = pretty(name.replace(main + '', '').replace(/\((.*?)\)/, (_, m) => m));
        // console.log(subset);
        (res[main] ??= []).push({
            name: subset,
            index: scoreNames.indexOf(name)
        });
    }
    return res;
}
// export type Scores = {
//     overall: number[],
//     auto: {
//         [x: string]: (boolean[]|number[])|ScoreAmount,
//     },
//     teleop: {
//         [x: string]: (boolean[]|number[])|ScoreAmount,
//     },
//     accuracy: {
//         [x: string]: number[],
//     }
// }

export function getAverageScore(matches: Match[]): Score {
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
    // type Scores = typeof res;
    //@ts-ignore
    matches.forEach(({ score }: { score: Record<string, any> }) => {
        res.overall.push(score.overall);
        res.auto.score.push(score.auto.score);
        res.auto.leave.push(score.auto.leave);
        for (let s of Config.scoring) {
            res.auto[coerce<Record<string, any>>(s).name].amount.push(score.auto[s.name].amount);
            res.auto[s.name].points.push(score.auto[s.name].points);
            res.teleop[s.name].amount.push(score.teleop[s.name].amount);
            res.teleop[s.name].points.push(score.teleop[s.name].points);
            res.accuracy[s.name].push(score.accuracy[s.name]);
        }
        for (let end of Config.end) {
            res.teleop[end.name].push(score.teleop[end.name]);
        }
        // res.auto[Config.primaryScore.name].amount.push(score.auto[Config.primaryScore.name].amount);
        // res.auto[Config.primaryScore.name].points.push(score.auto[Config.primaryScore.name].points);
        // res.auto[Config.secondaryScore.name].amount.push(score.auto[Config.secondaryScore.name].amount);
        // res.auto[Config.secondaryScore.name].points.push(score.auto[Config.secondaryScore.name].points);
        res.teleop.score.push(score.teleop.score);
        // res.teleop[Config.endGoal.name].push(score.teleop[Config.endGoal.name]);
        // res.teleop[Config.secondaryEndGoal.name].push(score.teleop[Config.secondaryEndGoal.name]);
        // res.teleop[Config.primaryScore.name].amount.push(score.teleop[Config.primaryScore.name].amount);
        // res.teleop[Config.primaryScore.name].points.push(score.teleop[Config.primaryScore.name].points);
        // res.teleop[Config.secondaryScore.name].amount.push(score.teleop[Config.secondaryScore.name].amount);
        // res.teleop[Config.secondaryScore.name].points.push(score.teleop[Config.secondaryScore.name].points);
        res.accuracy.overall.push(score.accuracy.overall);
        // res.accuracy[Config.primaryScore.name].push(score.accuracy[Config.primaryScore.name]);
        // res.accuracy[Config.secondaryScore.name].push(score.accuracy[Config.secondaryScore.name]);
    });
    let avg: Score = {
        overall: average(res.overall),
        auto: {
            score: average(res.auto.score),
            leave: average(res.auto.leave),
            // [Config.primaryScore.name]: {
            //     amount: average(res.auto[Config.primaryScore.name].amount),
            //     points: average(res.auto[Config.primaryScore.name].points)
            // },
            // [Config.secondaryScore.name]: {
            //     amount: average(res.auto[Config.secondaryScore.name].amount),
            //     points: average(res.auto[Config.secondaryScore.name].points)
            // },
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
            // [Config.endGoal.name]: average(res.teleop[Config.endGoal.name]),
            // [Config.secondaryEndGoal.name]: average(res.teleop[Config.secondaryEndGoal.name]),
            ...Object.fromEntries(Config.end.map(({ name }) => [name, average(res.teleop[name])])),
            // [Config.primaryScore.name]: {
            //     amount: average(res.teleop[Config.primaryScore.name].amount),
            //     points: average(res.teleop[Config.primaryScore.name].points)
            // },
            // [Config.secondaryScore.name]: {
            //     amount: average(res.teleop[Config.secondaryScore.name].amount),
            //     points: average(res.teleop[Config.secondaryScore.name].points)
            // },
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
    let { length } = arr;
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
export function splitParts<T>(arr: T[], amount: number): T[][] {
    let res = [];
    let part: T[] = [];
    arr.forEach((item) => {
        part.push(item);
        if (part.length === amount) {
            res.push(part);
            part = [];
        }
    });
    if (part.length > 0) {
        res.push(part);
        part = [];
    }
    return res;
}
export function chooseAlliances(array: number[]): number[][] {
    let result = [];
    let arr = [...array];
    for (let i = 0; i < 8; i++) {
        if (arr.length !== 0) {
            let alliance = [arr.shift()];
            if (arr.length !== 0) {
                alliance.push(arr.shift());
            }
            result.push(coerce<number[]>(alliance));
        }
    }
    result.toReversed().forEach((alliance: number[]) => {
        if (arr.length !== 0) alliance.push(coerce<number>(arr.shift()));
    });
    result.forEach((alliance: number[]) => {
        if (arr.length !== 0) alliance.push(coerce<number>(arr.shift()));
    });
    return coerce<number[][]>(result);
}
