import type {Config} from '$lib/types';
let amps = 0;
let charged = false;
let chargeStart = 0;
let assists = 0;
let state = {
    assists,
    charged,
    points:0,
    leave:false,
    endGoal:false,
    secondaryEndGoal:false,
    primaryScore:{
        amount: 0,
        points: 0,
    },
    secondaryScore:{
        amount: 0,
        points: 0,
    }
};
type Action = typeof state;
let actions:Action[] = [];
let undone:Action[] = [];
let gameState = "auto";
export default {
    reset(){
        actions = [];
        undone = [];
        gameState = "auto";
        state = {
            assists,
            charged,
            points:0,
            leave:false,
            endGoal:false,
            secondaryEndGoal:false,
            primaryScore:{
                amount: 0,
                points: 0,
            },
            secondaryScore:{
                amount: 0,
                points: 0,
            }
        };
        amps = 0;
        charged = false;
        chargeStart = 0;
        assists = 0;
    },
    get undoAvailable(){
        return actions.length === 0;
    },
    get redoAvailable(){
        return undone.length === 0;
    },
    undo(){
        if(actions.length === 0) return state;
        let lastAction = actions.pop();
        undone.push(lastAction!);
        state = lastAction!;
        return lastAction!;
    },
    redo(){
        if(undone.length === 0) return state;
        let lastUndone = undone.pop();
        actions.push(lastUndone!);
        state = lastUndone!;
        return lastUndone!;
    },
    assist(){
        actions.push({...state});
        assists++;
        state.assists = assists;
        return state;
    },
    primaryScore: {
        name: "speaker",
        auto: {
            points: 5,
        },
        get teleop() {
            if(gameState === "auto"){
                gameState = "teleop";
                state.primaryScore = {amount:0,points:0};
                state.secondaryScore = {amount:0,points:0};
            }
            return {
                get points(){
                    let points = state.charged ? 5 : 2;
                    return points;
                }
            }
        },
        score(points:number){
            actions.push({...state});
            state.points+=points;
            if(state.charged && (Date.now()-chargeStart)/1000 > 15){
                state.charged = false;
            }
            state.primaryScore.amount++;
            state.primaryScore.points+=points;
            return state;
        }
    },
    secondaryScore: {
        name: "amp",
        auto: {
            points: 2,
        },
        get teleop(){
            if(gameState === "auto"){
                gameState = "teleop";
                state.primaryScore = {amount:0,points:0};
                state.secondaryScore = {amount:0,points:0};
            }
            return {
                points: 1,
            }
        },
        score(points:number){
            actions.push({...state});
            state.points+=points;
            amps++;
            if(amps === 2){
                state.charged = true;
                chargeStart = Date.now();
            }
            state.secondaryScore.amount++;
            state.secondaryScore.points+=points;
            return state;
        },
    },
    leave: {
        name: "Leave",
        points: 2,
        score(points:number){
            actions.push({...state});
            state.leave = true;
            state.points+=points;
            return state;
        }
    },
    endGoal: {
        name: "climb",
        points: 3,
        score(points:number){
            if(gameState === "auto"){
                gameState = "teleop";
                state.primaryScore = {amount:0,points:0};
                state.secondaryScore = {amount:0,points:0};
            }
            actions.push({...state});
            state.endGoal = true;
            state.points+=points;
            return state;
        }
    },
    secondaryEndGoal: {
        name: "park",
        points: 1,
        score(points:number){
            if(gameState === "auto"){
                gameState = "teleop";
                state.primaryScore = {amount:0,points:0};
                state.secondaryScore = {amount:0,points:0};
            }
            actions.push({...state});
            state.secondaryEndGoal = true;
            state.points+=points;
            return state;
        }
    },
} as const satisfies Config;