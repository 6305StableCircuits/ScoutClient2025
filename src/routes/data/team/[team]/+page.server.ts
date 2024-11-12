//import type { PageLoad } from './$types';
import type {Match} from '$lib/types';
import {json} from '@sveltejs/kit'
import * as fs from 'fs';
type Params = {team:number}
export const load = async ({params}:{params:Params}) => {
	const data = JSON.parse(fs.readFileSync('./src/routes/api/data.json','utf-8')??'{}');
	let matches = data.matches.find((match:Match)=>match?.team?.toString?.() === params.team.toString());
	return Response.json(data);
};