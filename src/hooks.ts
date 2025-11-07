import type { Transport } from '@sveltejs/kit';
import Match from './lib/Match.svelte';

export const transport: Transport = {
    Match: {
        encode(value: Match) {
            return value instanceof Match && value.serialize();
        },
        decode(data) {
            return Match.from(data);
        }
    }
};
