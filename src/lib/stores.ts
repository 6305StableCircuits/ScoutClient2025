import {writable, readable} from 'svelte/store';
import { persisted } from 'svelte-persisted-store';
export {get} from 'svelte/store';
export const matches = persisted("matches",writable({matches:[]}));
export const scouter = persisted('scouter',writable(""));