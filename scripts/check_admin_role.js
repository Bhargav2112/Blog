
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const adminEmail = process.env.VITE_ADMIN_EMAIL;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminRole() {
  console.log(`🔍 Checking role for ${adminEmail}...`);

  // First get the user ID from auth (though we can't query auth.users directly with anon key usually)
  // We'll try to find them in public.profiles by email if that column is exposed.

  const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", adminEmail);

  if (error) {
    console.error("❌ Error fetching profile:", error.message);
    return;
  }

  if (profiles && profiles.length > 0) {
    console.log("✅ Profile found:", profiles[0]);
    if (profiles[0].role !== 'admin') {
        console.warn("⚠️  User exists but role is NOT admin. It is:", profiles[0].role);
    } else {
        console.log("✅ User has 'admin' role.");
    }
  } else {
    console.error("❌ Profile not found in public.profiles table.");
  }
}

checkAdminRole();
