import {supabase} from '$lib/supabase';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
export const load = async (): Promise<object> => {
    return {
        countries: await supabase.from("scoutingData").select() ?? [] as unknown as any,
    }
}