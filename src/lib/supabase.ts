import type { RequestHandler } from '../routes/supabase/$types';
import {json} from '@sveltejs/kit'
import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config();

const supabaseUrl = 'https://ujpszjmkuhaknmzevzxg.supabase.co';
const supabaseKey = process.env.UNFUN_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);