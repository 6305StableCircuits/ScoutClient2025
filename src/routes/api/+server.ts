import type { RequestHandler } from './$types';
import {json} from '@sveltejs/kit'
//@ts-ignore
import * as fs from 'fs';

export const GET: RequestHandler = async () => {
    const data = JSON.parse(fs.readFileSync('./src/routes/api/data.json','utf-8')??'{}');
    return json(data);
};

export const POST: RequestHandler = async ({ request }) => {
    const data = JSON.parse(fs.readFileSync('./src/routes/api/data.json','utf-8')??'{}');
    data.matches??=[];
    data.matches.push(...(await request.json())?.matches??[]);
    fs.writeFileSync('./src/routes/api/data.json',JSON.stringify(data,null,4));
    return json({status: 200})
};