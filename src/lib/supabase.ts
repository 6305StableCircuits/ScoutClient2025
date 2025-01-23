import type { RequestHandler } from '../routes/supabase/$types';
import {json} from '@sveltejs/kit'
import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js'
// import { SUPA_BASE_API_KEY } from '$env/static/private';

const supabaseUrl = 'https://ujpszjmkuhaknmzevzxg.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcHN6am1rdWhha25temV2enhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNjE0NjMsImV4cCI6MjA1MjczNzQ2M30.QzJqXUJzhjgRsPFSR-4ISpIOlsUU2gxzA_9mDBAE4ng";
export const supabase = createClient(supabaseUrl, supabaseKey);