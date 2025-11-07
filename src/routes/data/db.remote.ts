import { query } from '$app/server';
import Match from '$lib/Match.svelte';
import { supabase } from '$lib/supabase';

export const matches = query(async () => {
    const { data } = await supabase.from('scoutingData').select('*');
    const matches = [];
    for (const match of data!) {
        matches.push(Match.from(match));
    }
    return matches;
});
