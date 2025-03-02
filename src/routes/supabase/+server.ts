import { supabase } from '$lib/supabase';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export async function GET() {
    const { data } = await supabase.from('scoutingData').select('*');
    return json({
        scoutingData: data ?? []
    });
}

export const POST: RequestHandler = async ({ request }) => {
    const res = await request.json();
    const data = await supabase.from('scoutingData').insert(res.matches);
    return json({ status: 200 });
};
