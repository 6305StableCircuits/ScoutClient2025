import { onMount } from 'svelte';
onMount(() => {
    return () => {
        for (const timeout of timeouts) {
            clearTimeout(timeout);
        }
        timeouts = [];
    }
});
let timeouts: number[] = [];
export function timeout<T extends (...args: any[]) => any | void>(
    fn: T,
    delay: number = 0,
    ...args: Parameters<T>
): Promise<Awaited<ReturnType<T>>> {
    const { promise, resolve, reject } = Promise.withResolvers<Awaited<ReturnType<T>>>();
    timeouts.push(setTimeout(async () => {
        try {
            resolve(await fn(...args));
        } catch(err) {
            reject(err);
        }
    }, delay) as unknown as number);
    return promise;
}
