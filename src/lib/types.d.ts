import type {Snippet} from 'svelte';

declare interface Props {
    children?:Snippet
}

declare type StringLike = string|number|bigint

declare type StyleSize = `${number}xl`|`xl`|"lg"|"md"|"sm"
declare type Match = {
    team: number,
    match: number,
    scout: string
}