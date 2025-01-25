import { supabase } from "$lib/supabase";
import type { RequestHandler } from './$types';
import {json} from '@sveltejs/kit';
import * as fs from 'fs';

export async function GET() {
  const { data } = await supabase.from("scoutingData").select();
  return {
    scoutingData: data ?? [],
  };
}

export const POST: RequestHandler = async ({ request }) => {
  const res = await request.json();
  const data = await supabase.from("scoutingData").insert({"match": 2});
  // res.matches
  return json({status: 200})
};