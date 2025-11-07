// ONLY IMPORT THIS ON THE SERVER
let keys = new Set<[number, number]>();
export function generate() {
    const to_remove = new Set<[number, number]>();
    for (const key of keys) {
        const ms = Date.now() - key[1];
        const s = ms / 1000;
        const m = s / 60;
        const h = m / 60;
        if (h > 1) {
            // if key is more than an hour old, remove it
            to_remove.add(key);
        }
    }
    for (const key of to_remove) {
        keys.delete(key);
    }
    const ret = random();
    keys.add([ret, Date.now()]);
    return ret;
}

function random() {
    return crypto.getRandomValues(new Uint32Array([0]))[0];
}

export function validate(key: number): boolean {
    const found = [...keys].some(([test]) => test === key);
    if (found) {
        return true;
    } else {
        return false;
    }
}

export function invalidate(key: number): void {
    const found = [...keys].find(([test]) => test === key);
    keys.delete(found!);
}
