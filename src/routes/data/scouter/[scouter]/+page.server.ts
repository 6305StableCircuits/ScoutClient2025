//import type { PageLoad } from './$types';
import { supabase } from '$lib/supabase';

type Params = { scouter: string };
export const load = async ({ params }: { params: Params }) => {
    const { data = [] } = await supabase.from('scoutingData').select('*');
    return {
        data,
        matches: data!,
        scouter: params.scouter
    };
};
