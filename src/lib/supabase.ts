import type { RequestHandler } from '../routes/supabase/$types';
import {json} from '@sveltejs/kit'
import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js'
import { API_KEY } from '$env/static/private';

const supabaseUrl = 'https://ujpszjmkuhaknmzevzxg.supabase.co';
const supabaseKey = API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);