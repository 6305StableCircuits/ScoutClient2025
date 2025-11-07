import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
// import type { Match } from '$lib/types';
import { persisted } from 'svelte-persisted-store';
import Match from './Match.svelte';

function deep<T extends object>(
    initial: T,
    to_store: (value: T) => Writable<T> = (value: T) => writable(value)
): Writable<T> {
    const store = to_store(initial);
    const proxy = (value: T) =>
        new Proxy(value, {
            get(_, property) {
                return get(store)[property as keyof T];
            },
            set(_, property, value) {
                const object = get(store);
                const key = property as keyof T;
                if (object[key] !== (object[key] = value)) {
                    store.set(object);
                }
                return true;
            },
            deleteProperty(_, property) {
                const object = get(store);
                const key = property as keyof T;
                if (Object.hasOwn(object, key)) {
                    delete object[key];
                    store.set(object);
                }
                return true;
            },
            ownKeys() {
                return Reflect.ownKeys(get(store));
            },
            defineProperty(_, property, descriptor) {
                const object = get(store);
                const res = Reflect.defineProperty(object, property, descriptor);
                store.set(object);
                return res;
            }
        });
    let object = proxy(initial);
    return {
        subscribe(run, invalidate) {
            return store.subscribe(run, invalidate);
        },
        set(value) {
            if (value !== get(store)) {
                object = proxy(value);
            }
            return store.set(value);
        },
        update(updater) {
            const value = updater(object);
            store.set(value);
            if (value !== get(store)) {
                return (object = proxy(value));
            }
            return value;
        }
    };
}
export const matches = persisted<{ matches: Match[]; key?: number }>('matches', { matches: [] });
export const scouter = persisted('scouter', '', {
    serializer: {
        parse: (v: string) => v,
        stringify: (v: string) => v
    }
});
let scout_state_value = 0;
let subscribers = Symbol('subscribers');
export const scout_state = {
    subscribe(fn: (v?: typeof scout_state_value) => any) {
        fn(scout_state_value);
        this[subscribers].add(fn);
        return () => {
            this[subscribers].delete(fn);
        };
    },
    [subscribers]: new Set<(v?: number) => any>(),
    set(v: number) {
        if (v !== scout_state_value) {
            scout_state_value = v;
            for (const subscriber of this[subscribers]) {
                subscriber(v);
            }
        }
    }
};
export const alliance = persisted<Match['alliance']>('alliance', 'red');
type Settings = {
    mode: 'dark' | 'light';
    fish: boolean;
    scoutFont: 'default' | 'papyrus' | 'sans';
};
export const settings = persisted<Settings>('settings', {
    mode:
        (globalThis?.window?.matchMedia?.('prefers-color-scheme: dark') ?? true) ? 'dark' : 'light',
    fish: true,
    scoutFont: 'default'
});
export const started_current_match = writable(false);
export const current_match = writable(new Match(get(scouter), 0, 0, get(alliance)));
// if(typeof get(scouter) === "object"){
//     scouter.set("")
// }
