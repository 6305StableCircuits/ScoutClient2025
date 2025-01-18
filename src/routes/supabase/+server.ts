import type { RequestHandler } from './$types';
import {json} from '@sveltejs/kit'
import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js'
import { SUPA_BASE_API_KEY } from '$env/static/private';

const supabaseUrl = 'https://ujpszjmkuhaknmzevzxg.supabase.co';
const supabaseKey = SUPA_BASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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