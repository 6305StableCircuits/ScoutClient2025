import { DEV } from 'esm-env';
import Config from './config';
import Timer, { sleep } from '$lib/Timer.svelte';

export default class Match {
    static State = class State {
        match: Match;
        timer = new Timer(DEV ? '0:30' : '2:30');
        state = $state<'pre' | 'auto' | 'teleop' | 'post'>('pre');
        start() {
            this.match.date = Date.now();
            this.state = 'auto';
            this.timer.start();
            this.timer.on('2:15', () => {
                this.timer.pause();
                sleep(3).then(() => {
                    this.timer.play();
                    this.state = 'teleop';
                });
            });
            this.timer.on('finish', () => {
                this.state = 'post';
            });
        }
        constructor(...args: ConstructorParameters<typeof Match>) {
            this.match = new Match(...args);
        }
    };
    static Scoring = class Scoring {
        overall: number;
        auto = $state({
            score: 0,
            leave: false,
            ...Config.scoring.reduce(
                (acc, scoring) => ({
                    ...acc,
                    [scoring.name]: {
                        amount: 0,
                        points: 0
                    }
                }),
                {}
            )
        } as { score: number; leave: boolean } & Record<
            (typeof Config.scoring)[number]['name'],
            { amount: number; points: number }
        >);
        teleop = $state({
            score: 0,
            ...Config.scoring.reduce(
                (acc, scoring) => ({
                    ...acc,
                    [scoring.name]: {
                        amount: 0,
                        points: 0
                    }
                }),
                {}
            ),
            ...Config.end.reduce(
                (acc, scoring) => ({
                    ...acc,
                    [scoring.name]: false
                }),
                {}
            )
        } as { score: number } & Record<
            (typeof Config.scoring)[number]['name'],
            { amount: number; points: number }
        > &
            Record<(typeof Config.end)[number]['name'], boolean>);
        accuracy = $state({
            overall: 0,
            ...Config.scoring.reduce(
                (acc, scoring) => ({
                    ...acc,
                    [scoring.name]: {
                        amount: 0,
                        points: 0
                    }
                }),
                {}
            )
        } as { overall: number } & Record<
            (typeof Config.scoring)[number]['name'],
            { amount: number; points: number }
        >);
        get concise() {
            const { teleop, auto } = this;
            const overall = () => this.overall;
            return {
                get auto() {
                    return auto.score;
                },
                set auto(next: number) {
                    auto.score = next;
                },
                get teleop() {
                    return teleop.score;
                },
                set teleop(next: number) {
                    teleop.score = next;
                },
                get overall() {
                    return overall();
                }
            };
        }
        toJSON() {
            return {
                overall: this.overall,
                auto: this.auto,
                teleop: this.teleop,
                accuracy: this.accuracy
            };
        }
        constructor() {
            this.overall = $derived(this.auto.score + this.teleop.score);
        }
        static from(object: {
            overall: number;
            auto: object;
            teleop: object;
            accuracy: object;
        }): Scoring {
            const res = new Match.Scoring();
            Object.assign(res, object);
            return res;
        }
    };
    static from({
        team,
        match,
        scout,
        alliance,
        score,
        ...object
    }: {
        team: number;
        match: number;
        date: number;
        scout: string;
        alliance: 'red' | 'blue';
        score: {
            overall: number;
            auto: object;
            teleop: object;
            accuracy: object;
        };
        notes: string | null;
        assists: number;
    }) {
        const res = new Match(scout, team, match, alliance);
        Object.assign(res, object);
        res.score = Match.Scoring.from(score);
        return res;
    }
    serialize(): {
        team: number;
        match: number;
        date: number;
        scout: string;
        alliance: 'red' | 'blue';
        score: {
            overall: number;
            auto: object;
            teleop: object;
            accuracy: object;
        };
        notes: string | null;
        assists: number;
    } {
        const { team, match, date, scout, alliance, score, notes, assists } = this;
        const { overall, auto, teleop, accuracy } = score;
        return {
            team,
            match,
            date,
            scout,
            alliance,
            notes,
            assists,
            score: {
                overall,
                auto,
                teleop,
                accuracy
            }
        };
    }
    team = $state(0);
    match = $state(0);
    date = $state(0);
    scout = $state('');
    notes = $state<string | null>(null);
    alliance = $state<'red' | 'blue'>('red');
    score = new Match.Scoring();
    toJSON() {
        return {
            match: this.match,
            scout: this.scout,
            score: this.score,
            team: this.team,
            date: this.date,
            alliance: this.alliance,
            notes: this.notes,
            assists: this.assists
        };
    }
    clone(): Match {
        type POJO<T> = {
            [K in keyof T]: T[K];
        };
        const score: POJO<InstanceType<typeof Match.Scoring>> = JSON.parse(
            JSON.stringify(this.score)
        );
        const scoring = Object.assign(new Match.Scoring(), score);
        const match_pojo: POJO<Match> = JSON.parse(JSON.stringify(this));
        const match = Object.assign(
            new Match(this.scout, this.team, this.match, this.alliance),
            match_pojo
        );
        match.score = scoring;
        return match;
    }
    assists = $state(0);
    constructor(scouter: string, team: number, match: number, alliance: 'red' | 'blue') {
        this.scout = scouter;
        this.team = team;
        this.match = match;
        this.alliance = alliance;
    }
}
