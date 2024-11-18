import type { PageServerLoad } from './$types';
import type {Match} from '$lib/types';
import {coerce} from '$lib';
import {json} from '@sveltejs/kit'
import * as fs from 'fs';
export const load: PageServerLoad = async ({params}) => {
	const data = JSON.parse(fs.readFileSync('./src/routes/api/data.json','utf-8')??'{}');
	let matches = data.matches.filter((match:Match)=>match?.team?.toString?.() === params.team.toString());
	return {
		data,
		matches,
		number: coerce<number>(params.team)*1
	};
};