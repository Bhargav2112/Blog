import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL: Supabase URL or Key is missing from environment variables.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseKey || "placeholder",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, 
      storage: window.localStorage,
    },
  }
);

if (supabaseUrl === "https://placeholder.supabase.co" || supabaseKey === "placeholder") {
    console.warn("⚠️ WARNING: Using placeholder Supabase credentials. Data will not load.");
} else {
    console.log("✅ Supabase Client Initialized");
}
