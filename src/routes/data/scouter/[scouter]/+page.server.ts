//import type { PageLoad } from './$types';
import type { Match } from '$lib/types';
import { json } from '@sveltejs/kit';
//@ts-ignore
import * as fs from 'fs';
type Params = { scouter: string };
export const load = async ({ params }: { params: Params }) => {
    const data = JSON.parse(fs.readFileSync('./src/routes/api/data.json', 'utf-8') ?? '{}');
    let matches = data.matches.filter(
        (match: Match) => match?.scout?.toString?.() === params.scouter.toString()
    );
    return {
        data,
        matches,
        scouter: params.scouter
    };
};
