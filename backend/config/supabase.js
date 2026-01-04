
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Using strict variable names from frontend, but standard would be SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // If not in .env, try to read from frontend .env if possible or warn
    console.warn('Supabase credentials not found in backend .env');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
