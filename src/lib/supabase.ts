import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://ujpszjmkuhaknmzevzxg.supabase.co';
const supabaseKey = process.env.FUN_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey!);