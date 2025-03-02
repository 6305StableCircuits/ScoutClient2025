import type { Time, TimerOptions } from '$lib/types';
import { onDestroy } from 'svelte';
let dateNow = $state<number>(0);
let interval = setInterval(() => {
    dateNow = Date.now();
}, 1);
export function init() {
    onDestroy(() => clearInterval(interval));
}
function format(time: number): string {
    if (time < 0) return '-' + format(Math.abs(time));
    let minutes = Math.abs(Math.floor(time / 60)).toString();
    let seconds = Math.abs(Math.floor(time % 60)).toString();
    seconds = seconds.length === 1 ? '0' + seconds : seconds;
    return `${minutes}:${seconds}`;
}
export default class Timer<T extends string | number> extends EventTarget {
    #init = $state<number>(0);
    #end = $state<number>(0);
    /**
     * Adds an event listener to the timer.
     */
    on(
        event: string,
        handler: EventListenerOrEventListenerObject | null,
        options?: AddEventListenerOptions | boolean
    ): void {
        return this.addEventListener(event, handler, options);
    }
    started = $state<boolean>(false);
    #amount = $state<number>(0);
    finished = $state<boolean>(false);
    #lastSecond = 0;
    #stop = false;
    paused = $state<boolean>(false);
    #curr = 0;
    /**
     * The current time of the timer.
     */
    time = $derived.by<number>(() => {
        if (this.started === false) return this.#amount;
        if (this.paused === true) return this.#curr;
        if (Math.round((this.#end - dateNow) / 1000) === 0 && this.finished !== true) {
            this.finished = true;
            this.dispatchEvent(new CustomEvent('finish'));
        }
        if (this.#lastSecond !== Math.round((this.#end - dateNow) / 1000)) {
            this.#lastSecond = Math.round((this.#end - dateNow) / 1000);
            this.dispatchEvent(new CustomEvent(`${format(this.#lastSecond)}`));
        }
        if (this.finished && this.#stop) return 0;
        this.#curr = (this.#end - dateNow) / 1000;
        return this.#curr;
    });
    /**
     * Returns the current timer's time formatted as HH:MM:SS.
     */
    get formatted() {
        return format(this.time);
    }
    /**
     * Starts the timer.
     */
    start = (): void => {
        this.started = true;
        this.#init = dateNow;
        let ms = this.#amount * 1000;
        this.#end = dateNow + ms;
        this.dispatchEvent(new CustomEvent('start'));
    };
    #pauseStart = 0;
    /**
     * Pauses the timer, if it is not finished.
     */
    pause = (): void => {
        if (this.finished === true) return;
        if (this.paused === true) return this.play();
        this.paused = true;
        this.#pauseStart = dateNow;
    };
    /**
     * Resumes the timer, if it was paused.
     */
    play = (): void => {
        if (this.finished === true) return;
        if (this.paused === false) return this.pause();
        this.#end += dateNow - this.#pauseStart;
        this.paused = false;
    };
    constructor(amount: T, { start = false, stop = true, ...events }: TimerOptions = {}) {
        super();
        this.#stop = stop;
        if ('events' in events) {
            events = events.events as Record<string, ()=>any>;
            Object.entries(events).forEach(([event, handler]) => {
                this.on(event, handler as () => void);
            });
        } else {
            Object.entries(events).forEach(([event, handler]) => {
                if (event.match(/^on/)) this.on(event.replace(/^on/, ''), handler as () => void);
            });
        }
        if (typeof amount === 'string') {
            let [minutes, seconds] = amount.split(':').map((a: string) => Number(a));
            this.#amount = minutes * 60 + seconds;
        } else {
            this.#amount = amount;
        }
        if (start === true) this.start();
    }
}
