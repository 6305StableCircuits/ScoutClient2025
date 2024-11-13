// place files you want to import through the `$lib` alias in this folder.
export let noop = () => {};
export let paths = ["scout","data","save","home"];
export function uppercase(string:string):string{
    return string.replace(/( [a-z])|(^[a-z])/g,(_,...m)=>(m[0]??"")+m[1].toUpperCase());
}