//import type { PageLoad } from './$types';
import { supabase } from '$lib/supabase';
import type { Match } from '$lib/types';
type Params = { match: number };
export const load = async ({ params }: { params: Params }) => {
    const { data = [] } = await supabase.from('scoutingData').select('*');
    let matches = data!.filter(
        (match: Match) => match?.match?.toString?.() === params.match.toString()
    );
    return {
        data,
        matches,
        number: params.match
    };
};
