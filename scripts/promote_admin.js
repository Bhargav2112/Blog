
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
const adminPassword = process.env.ADMIN_PASSWORD;

const supabase = createClient(supabaseUrl, supabaseKey);

async function promoteAdmin() {
  console.log(`🔐 Signing in as ${adminEmail}...`);

  const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (authError) {
    console.error("❌ Login failed:", authError.message);
    return;
  }

  const userId = session.user.id;
  console.log(`✅ Logged in. User ID: ${userId}`);

  console.log("🚀 Attempting to update role to 'admin' in 'profiles' table...");

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", userId)
    .select();

  if (error) {
    console.error("❌ Failed to update role:", error.message);
    console.log("ℹ️  This is likely due to RLS policies preventing users from updating their own role.");
  } else {
    console.log("✅ Role updated successfully!", data);
  }
}

promoteAdmin();
