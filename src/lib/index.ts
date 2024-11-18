// place files you want to import through the `$lib` alias in this folder.
import { page } from '$app/stores';
import type {Match,Score} from '$lib/types';
import {get} from 'svelte/store';
import Config from '$lib/config';
export let noop = () => {};
export let paths = {
    "home": "",
    scout:"scout",
    "save data": "save",
    "view data": "data",
} as const;
export let pathEntries = [["home","/"],["scout","/scout"],["save data","/save"],["view data","/data"]] as const;
/**
 * Formats a string from 'formatted string' to 'Formatted String'.
 */
export function uppercase(string:string):string{
    string??='';
    return string.replace(/(( |^)[a-z])/g,m=>m.toUpperCase());
}
export function isCurrentPath(path:string):boolean{
    let [p,c] = [path.replace(/(^\/)|(\/$)/g,''),get(page).url.pathname.replace(/(^\/)|(\/$)/g,'')];
    return p === c;
}
/**
 * Coerces a value to the specified type.
 * @template T The type you want to coerce to
 * @param {any} value The value to be coerced
 * @returns {T}
 */
export function coerce<T>(value:any):T{
    return value as unknown as T;
}
export function rank(matches:Match[]):number[]{
    let teams = [...new Set(matches.map(match=>match.team))];
    let scores = teams.map((team)=>({[team]:getAverageScore(matches.filter(match=>match.team===team))})).reduce((a,b)=>Object.assign(a,b),{});
    let rankings = Object.entries(scores).sort(([k,v],[k1,v1])=>v1.overall-v.overall).map(([team,score])=>{
        return coerce<number>(team)*1;
    });
    return rankings;
}
type ScoreAmount = {
    amount: number[],
    points: number[]
};
export type Scores = {
    overall: number[],
    auto: {
        score: number[],
        leave: boolean[],
        [Config.primaryScore.name]: ScoreAmount,
        [Config.secondaryScore.name]: ScoreAmount,
    },
    teleop: {
        score: number[],
        [Config.endGoal.name]: boolean[],
        [Config.secondaryEndGoal.name]: boolean[],
        [Config.primaryScore.name]: ScoreAmount,
        [Config.secondaryScore.name]: ScoreAmount,
    },
    accuracy: {
        overall: number[],
        [Config.primaryScore.name]: number[],
        [Config.secondaryScore.name]: number[],
    }
}
export function getAverageScore(matches:Match[]):Score{
    console.log(matches);
    let res:Scores = {
        overall: [],
        auto: {
            score: [],
            leave: [],
            [Config.primaryScore.name]: {
                amount: [],
                points: [],
            },
            [Config.secondaryScore.name]: {
                amount: [],
                points: [],
            },
        },
        teleop: {
            score: [],
            [Config.endGoal.name]: [],
            [Config.secondaryEndGoal.name]: [],
            [Config.primaryScore.name]: {
                amount: [],
                points: []
            },
            [Config.secondaryScore.name]: {
                amount: [],
                points: []
            },
        },
        accuracy: {
            overall: [],
            [Config.primaryScore.name]: [],
            [Config.secondaryScore.name]: [],
        }
    };
    //@ts-ignore
    matches.forEach(({score}:{score:Score})=>{
        res.overall.push(score.overall);
        res.auto.score.push(score.auto.score);
        res.auto.leave.push(score.auto.leave);
        res.auto[Config.primaryScore.name].amount.push(score.auto[Config.primaryScore.name].amount);
        res.auto[Config.primaryScore.name].points.push(score.auto[Config.primaryScore.name].points);
        res.auto[Config.secondaryScore.name].amount.push(score.auto[Config.secondaryScore.name].amount);
        res.auto[Config.secondaryScore.name].points.push(score.auto[Config.secondaryScore.name].points);
        res.teleop.score.push(score.teleop.score);
        res.teleop[Config.endGoal.name].push(score.teleop[Config.endGoal.name]);
        res.teleop[Config.secondaryEndGoal.name].push(score.teleop[Config.secondaryEndGoal.name]);
        res.teleop[Config.primaryScore.name].amount.push(score.teleop[Config.primaryScore.name].amount);
        res.teleop[Config.primaryScore.name].points.push(score.teleop[Config.primaryScore.name].points);
        res.teleop[Config.secondaryScore.name].amount.push(score.teleop[Config.secondaryScore.name].amount);
        res.teleop[Config.secondaryScore.name].points.push(score.teleop[Config.secondaryScore.name].points);
        res.accuracy.overall.push(score.accuracy.overall);
        res.accuracy[Config.primaryScore.name].push(score.accuracy[Config.primaryScore.name]);
        res.accuracy[Config.secondaryScore.name].push(score.accuracy[Config.secondaryScore.name]);
    });
    let avg:Score = {
        overall: average(res.overall),
        auto: {
            score: average(res.auto.score),
            leave: average(res.auto.leave),
            [Config.primaryScore.name]: {
                amount: average(res.auto[Config.primaryScore.name].amount),
                points: average(res.auto[Config.primaryScore.name].points)
            },
            [Config.secondaryScore.name]: {
                amount: average(res.auto[Config.secondaryScore.name].amount),
                points: average(res.auto[Config.secondaryScore.name].points)
            },
        },
        teleop: {
            score: average(res.teleop.score),
            [Config.endGoal.name]: average(res.teleop[Config.endGoal.name]),
            [Config.secondaryEndGoal.name]: average(res.teleop[Config.secondaryEndGoal.name]),
            [Config.primaryScore.name]: {
                amount: average(res.teleop[Config.primaryScore.name].amount),
                points: average(res.teleop[Config.primaryScore.name].points)
            },
            [Config.secondaryScore.name]: {
                amount: average(res.teleop[Config.secondaryScore.name].amount),
                points: average(res.teleop[Config.secondaryScore.name].points)
            },
        },
        accuracy: {
            overall: average(res.accuracy.overall),
            [Config.primaryScore.name]: average(res.accuracy[Config.primaryScore.name]),
            [Config.secondaryScore.name]: average(res.accuracy[Config.secondaryScore.name]),
        }
    };
    return avg;
}
export function average<T extends (boolean|number)>(arr:T[]):T{
    let {length} = arr;
    switch(typeof arr[0]){
        case "boolean":
            //@ts-ignore
            return deNaN(arr.reduce((a,b)=>{
                return a+(b?1:0);
            },0)/length) >= 0.5;
        case "number":
            //@ts-ignore
            return deNaN(arr.reduce((a,b)=>a+b,0)/length);
    }
}
export function deNaN(value:number):number{
    return value !== value ? 0 : value;
}
export function splitParts<T>(arr:T[],amount:number):T[][]{
    let res = [];
    let part:T[] = [];
    arr.forEach((item)=>{
        part.push(item);
        if(part.length === amount){
            res.push(part);
            part = [];
        }
    });
    if(part.length > 0){
        res.push(part);
        part = [];
    }
    return res;
}
export function chooseAlliances(array:number[]):number[][]{
    let result = [];
    let arr = [...array];
    for(let i = 0; i < 8; i++){
        if(arr.length !== 0){
            let alliance = [arr.shift()];
            if(arr.length !== 0){
                alliance.push(arr.shift());
            }
            result.push(coerce<number[]>(alliance));
        }
    }
    for(let i = 0; i < 4; i++){
        result.forEach((alliance:(number)[])=>{
            if(arr.length !== 0)
                alliance.push(coerce<number>(arr.shift()));
        })
    }
    return coerce<number[][]>(result);
}