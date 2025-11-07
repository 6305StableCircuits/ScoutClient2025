import type { Snippet } from 'svelte';
import Config from '$lib/config.ts';
export declare interface Props {
    children?: Snippet;
}

export declare type StringLike = string | number | bigint;

export declare type StyleSize = `${number}xl` | `xl` | 'lg' | 'md' | 'sm';
export declare type Scoring = {
    name: string;
    auto: {
        points: number;
    };
    teleop: {
        points: number;
    };
    score: (points: number) => Record<string, any>;
};
export declare type Score = {
    overall: number;
    auto: {
        score: number;
        leave: boolean;
        [x: typeof Config.scoring[number]['name']]: {
            amount: number;
            points: number;
        }
        [x: typeof Config.primaryScore.name]: {
            amount: number;
            points: number;
        };
        [x: typeof Config.secondaryScore.name]: {
            amount: number;
            points: number;
        };
    };
    teleop: {
        score: number;
        [x: typeof Config.scoring[number]['name']]: {
            amount: number;
            points: number;
        }
        [x: typeof Config.end[number]['name']]: boolean;
    };
    accuracy: {
        overall: number;
        [x: typeof Config.scoring[number]['name']]: number;
    };
};
export declare interface Match {
    team: number;
    match: number;
    date: number;
    scout: string;
    notes?: string;
    alliance: 'red' | 'blue';
    score: Record<string, any>;
    assists: number;
};
export declare type TeamData = {
    number: number;
    avg: {
        score: Score;
        assists: number;
    };
    prefers: typeof Config.scoring[number]['name'];
    matches: Match[];
};
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type EventName = `on${string}`;
export declare type NumberString = (typeof numbers)[number];
export declare type Time =
    `${'-' | ''}${NumberString}${NumberString | ''}:${NumberString}${NumberString}`;
export declare interface TimerOptions {
    start?: boolean;
    stop?: boolean;
    [x: EventName]: () => void;
    events?: {
        [event: string]: () => void;
    };
};
export declare type Config = {
    readonly reset: () => void;
    readonly undo: () => object;
    readonly redo: () => object;
    readonly assist: () => object;
    readonly undo_available: boolean;
    readonly redo_available: boolean;
    readonly scoring: Scoring[];
    readonly leave: Goal;
    readonly end: Goal[];
    readonly park: Goal;
};
type Goal = {
    readonly name: string;
    readonly points: number;
    readonly score: (points: number) => Record<string, any>;
};
type Scoring = {
    readonly name: string;
    readonly auto: {
        readonly points: number;
    };
    readonly teleop: {
        readonly points: number;
    };
    readonly score: (points: number) => object;
};
