import { supabase } from "$lib/supabase";
import {json} from '@sveltejs/kit';

export async function GET() {
  const { data } = await supabase.from("scoutingData").select();
  return {
    scoutingData: data ?? [],
  };
}

// export async function POST({request}) {
//   return json()
// }