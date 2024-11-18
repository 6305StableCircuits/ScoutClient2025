import {writable, readable} from 'svelte/store';
import type {Match} from '$lib/types';
import { persisted } from 'svelte-persisted-store';
import {get} from 'svelte/store';
import Config from '$lib/config';
export {get};
export const matches = persisted<{matches:Match[]}>("matches",{matches:[]});
export const scouter = persisted('scouter',"",{
    serializer: {
        parse: (v:string)=>v,
        stringify: (v:string)=>v
    }
});
export const scoutState = writable(0);
export const alliance = persisted<Match["alliance"]>("alliance","red");
export const currentMatch = writable<Match>({
    team: 0,
    match: 0,
    alliance: "red",
    scout: get(scouter),
    date: 0,
    score: {
        overall: 0,
        auto: {
            score: 0,
            leave: false,
            [Config.primaryScore.name]: {
                amount: 0,
                points: 0,
            },
            [Config.secondaryScore.name]: {
                amount: 0,
                points: 0,
            },
        },
        teleop: {
            score: 0,
            [Config.endGoal.name]: false,
            [Config.secondaryEndGoal.name]: false,
            [Config.primaryScore.name]: {
                amount: 0,
                points: 0,
            },
            [Config.secondaryScore.name]: {
                amount: 0,
                points: 0
            },
        },
        accuracy: {
            overall: 0,
            [Config.primaryScore.name]: 0,
            [Config.secondaryScore.name]: 0,
        }
    },
    assists: 0,
});
// if(typeof get(scouter) === "object"){
//     scouter.set("")
// }