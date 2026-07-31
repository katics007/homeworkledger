import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in the browser console rather than silently breaking saves.
  console.error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
    "in your .env (local) or your Vercel project's Environment Variables (deployed)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
