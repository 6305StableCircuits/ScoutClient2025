import type {Snippet} from 'svelte';
import Config from '$lib/config.ts';
export declare interface Props {
    children?:Snippet
}

export declare type StringLike = string|number|bigint

export declare type StyleSize = `${number}xl`|`xl`|"lg"|"md"|"sm"
export declare type Score = {
    overall: number,
    auto: {
        score: number,
        leave: boolean,
        [Config.primaryScore.name]: number,
        [Config.secondaryScore.name]: number,
    },
    teleop: {
        score: number,
        [Config.endGoal]: boolean,
        [Config.secondaryEndGoal]: boolean,
        [Config.primaryScore.name]: number,
        [Config.secondaryScore.name]: number,
    },
    accuracy: {
        overall: number,
        [Config.primaryScore.name]: number,
        [Config.secondaryScore.name]: number,
    }
}
export declare type Match = {
    team: number,
    match: number,
    date: number,
    scout: string,
    alliance: "red"|"blue",
    score: Score,
    assists: number,
}
export declare type TeamData = {
    number: number,
    avg: {
        score: Score,
        assists: number,
    },
    prefers: (typeof Config.primaryScore.name|typeof Config.secondaryScore.name),
    matches: Match[]
}
let numbers = [0,1,2,3,4,5,6,7,8,9] as const;
type EventName = `on${string}`
export declare type NumberString = typeof numbers[number]
export declare type Time = `${"-"|""}${NumberString}${NumberString|''}:${NumberString}${NumberString}`;
export declare type TimerOptions = {
    start?: boolean,
    stop?: boolean,
    [x: EventName]: ()=>void,
    events?: {
        [event: string]: ()=>void
    }
}