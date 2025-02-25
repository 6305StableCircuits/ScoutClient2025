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
        [Config.primaryScore.name]: {
            amount: number,
            points: number,
        },
        [Config.secondaryScore.name]: {
            amount: number,
            points: number,
        },
    },
    teleop: {
        score: number,
        [Config.endGoal.name]: boolean,
        [Config.secondaryEndGoal.name]: boolean,
        [Config.primaryScore.name]: {
            amount: number,
            points: number,
        },
        [Config.secondaryScore.name]: {
            amount: number,
            points: number,
        },
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
export declare type NumberString = typeof numbers[number];
export declare type Time = `${"-"|""}${NumberString}${NumberString|''}:${NumberString}${NumberString}`;
export declare type TimerOptions = {
    start?: boolean,
    stop?: boolean,
    [x: EventName]: ()=>void,
    events?: {
        [event: string]: ()=>void
    }
}
export declare type Config = {
    readonly reset: ()=>void,
    readonly undo: ()=>object,
    readonly redo: ()=>object,
    readonly assist: ()=>object,
    readonly undoAvailable: boolean,
    readonly redoAvailable: boolean,
    readonly scoring: Scoring[],
    readonly leave: Goal,
    readonly end: Goal[]
    readonly park: Goal
}
type Goal = {
    readonly name: string,
    readonly points: number,
    readonly score: (points: number) => object
}
type Scoring = {
    readonly name: string,
    readonly auto: {
        readonly points: number,
    },
    readonly teleop: {
        readonly points: number,
    },
    readonly score: (points: number) => object
}

export declare type IncrementorOpacities = "brightness-[50%]" | "brightness-[70%]" | "brightness-[80%]" | "brightness-[90%]" 
export declare type TeamColors = "Red" | "Blue"