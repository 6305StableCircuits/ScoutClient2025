import {supabase} from '$lib/supabase';
export const load = async (): Promise<object> => {
    return {
        scoutingStuff: await supabase.from("scoutingData").select() ?? [] as unknown as any,
    }
}