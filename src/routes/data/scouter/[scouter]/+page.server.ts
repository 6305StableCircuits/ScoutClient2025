//import type { PageLoad } from './$types';
import { supabase } from '$lib/supabase';
import type { Match } from '$lib/types';
import { json } from '@sveltejs/kit';
type Params = { scouter: string };
export const load = async ({ params }: { params: Params }) => {
    const { data = [] } = await supabase.from('scoutingData').select('*');
    let matches = data!.filter(
        (match: Match) => match?.scout?.toString?.() === params.scouter.toString()
    );
    return {
        data,
        matches,
        scouter: params.scouter
    };
};
