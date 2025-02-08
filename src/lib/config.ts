import type {Config} from '$lib/types';
let amps = 0;
let charged = false;
let chargeStart = 0;
let assists = 0;
let state: Record<string, any> = {};
let actions:Record<string, any>[] = [];
let undone:Record<string, any>[] = [];
let gameState = "auto";
let scoring: Config["scoring"][number]["name"][] = [];
let end: Config["end"][number]["name"][] = [];
var config: Config = {
    reset(){
        actions = [];
        undone = [];
        gameState = "auto";
        state = {
            assists,
            charged,
            points:0,
            leave:false,
            ...Object.fromEntries(this.end.map(({name}) => [name, false])),
            ...Object.fromEntries(this.scoring.map(({name}) => [name, {
                amount: 0,
                points: 0,
            }]))
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
    scoring: [
        {
            name: "coral (trough)",
            auto: {
                points: 3,
            },
            get teleop() {
                if(gameState === "auto"){
                    gameState = "teleop";
                    for (let score of scoring) {
                        state[score] = {
                            amount: 0,
                            points: 0,
                        };
                    }
                }
                return {
                    get points(){
                        return 2;
                    }
                }
            },
            score(points:number){
                actions.push({...state});
                state.points+=points;
                state["coral (trough)"].amount++;
                state["coral (trough)"].points+=points;
                return state;
            }
        },
        {
            name: "coral (l2 branch)",
            auto: {
                points: 4,
            },
            get teleop() {
                if(gameState === "auto"){
                    gameState = "teleop";
                    for (let score of scoring) {
                        state[score] = {
                            amount: 0,
                            points: 0,
                        };
                    }
                }
                return {
                    get points(){
                        return 3;
                    }
                }
            },
            score(points:number){
                actions.push({...state});
                state.points+=points;
                state["coral (l2 branch)"].amount++;
                state["coral (l2 branch)"].points+=points;
                return state;
            }
        },
        {
            name: "coral (l3 branch)",
            auto: {
                points: 6,
            },
            get teleop() {
                if(gameState === "auto"){
                    gameState = "teleop";
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0,
                        };
                    }
                }
                return {
                    get points(){
                        return 4;
                    }
                }
            },
            score(points:number){
                actions.push({...state});
                state.points+=points;
                state.scoring["coral (l3 branch)"].amount++;
                state.scoring["coral (l3 branch)"].points+=points;
                return state;
            }
        },
        {
            name: "coral (l4 branch)",
            auto: {
                points: 7,
            },
            get teleop() {
                if(gameState === "auto"){
                    gameState = "teleop";
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0,
                        };
                    }
                }
                return {
                    get points(){
                        return 5;
                    }
                }
            },
            score(points:number){
                actions.push({...state});
                state.points+=points;
                state.scoring["coral (l4 branch)"].amount++;
                state.scoring["coral (l4 branch)"].points+=points;
                return state;
            }
        },
        {
            name: "algae (processor)",
            auto: {
                points: 6,
            },
            get teleop(){
                if(gameState === "auto"){
                    gameState = "teleop";
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0,
                        };
                    }
                }
                return {
                    points: 6,
                }
            },
            score(points:number){
                actions.push({...state});
                state.points+=points;
                state.scoring["algae (processor)"].amount++;
                state.scoring["algae (processor)"].points+=points;
                return state;
            },
        },
        {
            name: "algae (net)",
            auto: {
                points: 4,
            },
            get teleop(){
                if(gameState === "auto"){
                    gameState = "teleop";
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0,
                        };
                    }
                }
                return {
                    points: 4,
                }
            },
            score(points:number){
                actions.push({...state});
                state.points+=points;
                state.scoring["algae (net)"].amount++;
                state.scoring["algae (net)"].points+=points;
                return state;
            },
        },
    ],
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
    end: [
        {
            name: "deep cage",
            points: 12,
            score(points:number){
                if(gameState === "auto"){
                    gameState = "teleop";
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0,
                        };
                    }
                }
                actions.push({...state});
                state.end["deep cage"] = true;
                state.points+=points;
                return state;
            }
        },
        {
            name: "shallow cage",
            points: 6,
            score(points:number){
                if(gameState === "auto"){
                    gameState = "teleop";
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0,
                        };
                    }
                }
                actions.push({...state});
                state.end["shallow cage"] = true;
                state.points+=points;
                return state;
            }
        }
    ],
    park: {
        name: "park",
        points: 2,
        score(points:number) {
            if (gameState === "auto") {
                gameState = "teleop";
                for (let score of scoring) {
                    state.scoring[score] = {
                        amount: 0,
                        points: 0,
                    };
                }
            }
            actions.push({...state});
            state.park = true;
            state.points+=points;
            return state;
        }
    }
} as const satisfies Config;
state = {
    assists,
    charged,
    points:0,
    leave:false,
    park: false,
    end: Object.fromEntries(config.end.map(({name}) => [name, false])),
    scoring: Object.fromEntries(config.scoring.map(({name}) => [name, {
        amount: 0,
        points: 0,
    }]))
};
scoring = config.scoring.map(({name}) => name);
end = config.end.map(({name}) => name);
type Action = {
    assists: number,
    charged: boolean,
    points: number,
    leave: boolean,
    end: {
        [x: (typeof config)["end"][number]["name"]]: boolean,
    },
    scoring: {
        [x: (typeof config)["scoring"][number]["name"]]: {
            amount: number, 
            points: number,
        }
    }
};
export default config;