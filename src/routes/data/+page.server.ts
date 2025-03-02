import type { PageServerLoad } from './$types';
import type { Match } from '$lib/types';
//@ts-ignore
import * as fs from 'fs';
import { supabase } from '$lib/supabase';
export const load: PageServerLoad = async () => {
    const { data } = await supabase.from('scoutingData').select('*');
    return {
        matches: data ?? []
    };
};
