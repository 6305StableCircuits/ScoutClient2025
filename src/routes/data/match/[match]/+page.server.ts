//import type { PageLoad } from './$types';
import type { Match } from '$lib/types';
import { json } from '@sveltejs/kit';
//@ts-ignore
import * as fs from 'fs';
type Params = { match: number };
export const load = async ({ params }: { params: Params }) => {
    const data = JSON.parse(fs.readFileSync('./src/routes/api/data.json', 'utf-8') ?? '{}');
    let matches = data.matches.filter(
        (match: Match) => match?.match?.toString?.() === params.match.toString()
    );
    return {
        data,
        matches,
        number: params.match
    };
};
