import Match from '$lib/Match.svelte';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { data = [] } = await supabase.from('scoutingData').select('*');
    return {
        matches: data!.map(match => Match.from(match)),
        scouter: params.scouter
    };
};
