import { supabase } from '$lib/supabase';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { validate } from '$lib/server';
import type { Match } from '$lib/types';

export async function GET() {
    const { data } = await supabase.from('scoutingData').select('*');
    return json({
        scoutingData: data ?? []
    });
}

export const POST: RequestHandler = async ({ request }) => {
    const res = await request.json();
    if (!('key' in res || 'matches' in res)) {
        return json({ status: 403 });
    }
    if (validate(res.key) && validate_matches(res.matches)) {
        const data = await supabase.from('scoutingData').insert(res.matches);
        return json({ status: 200 });
    }
    return json({ status: 403 });
};

function validate_matches(matches: Match[]): boolean {
    let valid_keys = {
        team: 'number',
        match: 'number',
        date: 'number',
        scout: 'string',
        notes: 'string',
        alliance: 'string',
        score: 'object',
        assists: 'number'
    } as const;
    const required = new Set(['team', 'match', 'scout', 'alliance', 'score', 'date']);
    for (let match of matches) {
        if (typeof match !== 'object' || match === null) {
            return false;
        }
        let seen = new Set();
        for (let key in match) {
            if (!(key in valid_keys)) return false;
            if (typeof match[key as keyof Match] !== valid_keys[key as keyof typeof valid_keys]) {
                return false;
            }
            seen.add(key);
        }
        if (!seen.isSupersetOf(required)) {
            return false;
        }
    }
    return true;
}
