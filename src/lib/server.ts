//ONLY IMPORT THIS ON THE SERVER
let keys = new Set<[number, number]>();
export function generate() {
    let to_remove = new Set<[number, number]>();
    for (let key of keys) {
        let ms = Date.now() - key[1];
        let s = ms / 1000;
        let m = s / 60;
        let h = m / 60;
        if (h > 1) {
            // if key is more than an hour old, remove it
            to_remove.add(key);
        }
    }
    for (let key of to_remove) {
        keys.delete(key);
    }
    let ret = random();
    keys.add([ret, Date.now()]);
    return ret;
}
function random() {
    return crypto.getRandomValues(new Uint32Array([0]))[0];
}
export function validate(key: number): boolean {
    let found = [...keys].find(([test, date]) => test === key);
    if (found) {
        keys.delete(found);
        return true;
    } else {
        return false;
    }
}
