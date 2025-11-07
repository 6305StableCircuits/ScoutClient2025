import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = 'https://kotupzmdqdmyhbqqvgiv.supabase.co';
const key = process.env.FUN_API_KEY;
export const supabase = createClient(url, key!);
