import { command, query } from '$app/server';
import Match from '$lib/Match.svelte';
import { generate, invalidate, validate } from '$lib/server';
import { supabase } from '$lib/supabase';
import * as v from 'valibot';

const valid_key = v.pipe(v.number(), v.check(validate));

export const save = command(
    v.object({
        matches: v.array(v.instance(Match)),
        key: valid_key
    }),
    async ({ matches, key }) => {
        invalidate(key);
        await supabase.from('scoutingData').insert(matches.map(match => match.serialize()));
    }
);

export const key_generator = query(valid_key, key => {
    invalidate(key);
    return generate();
});
