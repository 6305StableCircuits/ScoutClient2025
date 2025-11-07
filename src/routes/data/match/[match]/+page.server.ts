import { supabase } from '$lib/supabase';
import Match from '$lib/Match.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { data } = await supabase.from('scoutingData').select('*');
    const matches = (data ?? [])
        .filter((match: Match) => match?.match?.toString?.() === params.match)
        .map(match => Match.from(match));
    return {
        data,
        matches,
        number: params.match
    };
};
