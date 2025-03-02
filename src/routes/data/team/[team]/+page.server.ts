import type { PageServerLoad } from './$types';
import type { Match } from '$lib/types';
import { coerce } from '$lib';
import { json } from '@sveltejs/kit';

import { supabase } from '$lib/supabase';
export const load: PageServerLoad = async ({ params }) => {
    const { data = [] } = await supabase.from('scoutingData').select('*');
    let matches = data!.filter(
        (match: Match) => match?.team?.toString?.() === params.team.toString()
    );
    return {
        data,
        matches,
        number: coerce<number>(params.team) * 1
    };
};
