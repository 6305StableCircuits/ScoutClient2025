import type { Config } from '$lib/types';
let amps = 0;
let charged = false;
let charge_start = 0;
let assists = 0;
let state: Record<string, any> = {};
let actions: Record<string, any>[] = [];
let undone: Record<string, any>[] = [];
let game_state = 'auto';
let scoring: Config['scoring'][number]['name'][] = [];
let end: Config['end'][number]['name'][] = [];
var config: Config = {
    reset() {
        actions = [];
        undone = [];
        game_state = 'auto';
        state = {
            assists,
            charged,
            points: 0,
            leave: false,
            end: Object.fromEntries(this.end.map(({ name }) => [name, false])),
            scoring: Object.fromEntries(
                this.scoring.map(({ name }) => [
                    name,
                    {
                        amount: 0,
                        points: 0
                    }
                ])
            )
        };
        // console.log(state);
        assists = 0;
    },
    get undo_available() {
        return actions.length === 0;
    },
    get redo_available() {
        return undone.length === 0;
    },
    undo() {
        if (actions.length === 0) return state;
        const last_action = actions.pop();
        undone.push(last_action!);
        state = last_action!;
        return last_action!;
    },
    redo() {
        if (undone.length === 0) return state;
        const last_undone = undone.pop();
        actions.push(last_undone!);
        state = last_undone!;
        return last_undone!;
    },
    assist() {
        actions.push(structuredClone(state));
        assists++;
        state.assists = assists;
        return state;
    },
    scoring: [
        {
            name: 'coral (trough)',
            auto: {
                points: 3
            },
            get teleop() {
                if (game_state === 'auto') {
                    game_state = 'teleop';
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0
                        };
                    }
                }
                return {
                    get points() {
                        return 2;
                    }
                };
            },
            score(points: number) {
                actions.push(structuredClone(state));
                state.points += points;
                state.scoring['coral (trough)'].amount++;
                state.scoring['coral (trough)'].points += points;
                return state;
            }
        },
        {
            name: 'coral (l2 branch)',
            auto: {
                points: 4
            },
            get teleop() {
                if (game_state === 'auto') {
                    game_state = 'teleop';
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0
                        };
                    }
                }
                return {
                    get points() {
                        return 3;
                    }
                };
            },
            score(points: number) {
                actions.push(structuredClone(state));
                state.points += points;
                state.scoring['coral (l2 branch)'].amount++;
                state.scoring['coral (l2 branch)'].points += points;
                return state;
            }
        },
        {
            name: 'coral (l3 branch)',
            auto: {
                points: 6
            },
            get teleop() {
                if (game_state === 'auto') {
                    game_state = 'teleop';
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0
                        };
                    }
                }
                return {
                    get points() {
                        return 4;
                    }
                };
            },
            score(points: number) {
                actions.push(structuredClone(state));
                state.points += points;
                state.scoring['coral (l3 branch)'].amount++;
                state.scoring['coral (l3 branch)'].points += points;
                return state;
            }
        },
        {
            name: 'coral (l4 branch)',
            auto: {
                points: 7
            },
            get teleop() {
                if (game_state === 'auto') {
                    game_state = 'teleop';
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0
                        };
                    }
                }
                return {
                    get points() {
                        return 5;
                    }
                };
            },
            score(points: number) {
                actions.push(structuredClone(state));
                state.points += points;
                state.scoring['coral (l4 branch)'].amount++;
                state.scoring['coral (l4 branch)'].points += points;
                return state;
            }
        },
        {
            name: 'algae (processor)',
            auto: {
                points: 6
            },
            get teleop() {
                if (game_state === 'auto') {
                    game_state = 'teleop';
                    for (let score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0
                        };
                    }
                }
                return {
                    points: 6
                };
            },
            score(points: number) {
                actions.push(structuredClone(state));
                state.points += points;
                state.scoring['algae (processor)'].amount++;
                state.scoring['algae (processor)'].points += points;
                return state;
            }
        },
        {
            name: 'algae (net)',
            auto: {
                points: 4
            },
            get teleop() {
                if (game_state === 'auto') {
                    game_state = 'teleop';
                    for (const score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0
                        };
                    }
                }
                return {
                    points: 4
                };
            },
            score(points: number) {
                actions.push(structuredClone(state));
                state.points += points;
                state.scoring['algae (net)'].amount++;
                state.scoring['algae (net)'].points += points;
                return state;
            }
        }
    ],
    leave: {
        name: 'Leave',
        points: 2,
        score(points: number) {
            actions.push(structuredClone(state));
            state.leave = true;
            state.points += points;
            return state;
        }
    },
    end: [
        {
            name: 'park',
            points: 2,
            score(points: number) {
                if (game_state === 'auto') {
                    game_state = 'teleop';
                    for (const score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0
                        };
                    }
                }
                actions.push(structuredClone(state));
                state.end['park'] = true;
                state.points += points;
                return state;
            }
        },
        {
            name: 'deep cage',
            points: 12,
            score(points: number) {
                if (game_state === 'auto') {
                    game_state = 'teleop';
                    for (const score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0
                        };
                    }
                }
                state.end['deep cage'] = true;
                state.points += points;
                return state;
            }
        },
        {
            name: 'shallow cage',
            points: 6,
            score(points: number) {
                if (game_state === 'auto') {
                    game_state = 'teleop';
                    for (const score of scoring) {
                        state.scoring[score] = {
                            amount: 0,
                            points: 0
                        };
                    }
                }
                actions.push(structuredClone(state));
                state.end['shallow cage'] = true;
                state.points += points;
                return state;
            }
        }
    ],
    park: {
        name: 'park',
        points: 2,
        score(points: number) {
            if (game_state === 'auto') {
                game_state = 'teleop';
                for (const score of scoring) {
                    state.scoring[score] = {
                        amount: 0,
                        points: 0
                    };
                }
            }
            actions.push(structuredClone(state));
            state.park = true;
            state.points += points;
            return state;
        }
    }
} as const satisfies Config;
state = {
    assists,
    charged,
    points: 0,
    leave: false,
    park: false,
    end: Object.fromEntries(config.end.map(({ name }) => [name, false])),
    scoring: Object.fromEntries(
        config.scoring.map(({ name }) => [
            name,
            {
                amount: 0,
                points: 0
            }
        ])
    )
};
scoring = config.scoring.map(({ name }) => name);
end = config.end.map(({ name }) => name);
export default config;
