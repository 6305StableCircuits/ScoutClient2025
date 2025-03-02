import type { PageServerLoad } from './$types';
import type { Match } from '$lib/types';
//@ts-ignore
import * as fs from 'fs';
export const load: PageServerLoad = async () => {
    const data = JSON.parse(fs.readFileSync('./src/routes/api/data.json', 'utf-8') ?? '{}');
    return {
        matches: data?.matches
    };
};
