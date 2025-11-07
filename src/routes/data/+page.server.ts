import type { PageServerLoad } from './$types';
import Match from '$lib/Match.svelte';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async () => {
    const { data } = await supabase.from('scoutingData').select('*');
    return {
        matches: data!.map(match => Match.from(match))
    };
};
