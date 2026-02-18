import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("🔍 STARTING DIAGNOSTIC SCAN...");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ CRITICAL: Missing Environment Variables!");
  console.error("   VITE_SUPABASE_URL:", supabaseUrl);
  console.error("   VITE_SUPABASE_ANON_KEY:", supabaseKey ? "Found" : "Missing");
  process.exit(1);
}

console.log("✅ Credentials Found. Connecting to:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDiagnostics() {
  try {
    // 1. Check Tables
    console.log("\n1️⃣ Checking 'blog_posts' table accessibility...");
    const { data: posts, error: postError } = await supabase
      .from("blog_posts")
      .select("id, title, status, created_at")
      .limit(5);

    if (postError) {
      console.error("❌ FAILED to read 'blog_posts':", postError.message);
      console.error("   Hint: RLS Policies might be blocking access, or table doesn't exist.");
    } else {
      console.log(`✅ Success! Found ${posts.length} posts.`);
      if (posts.length === 0) {
        console.warn("⚠️  Table exists but is EMPTY. Did you run the Seeding SQL?");
      } else {
        console.log("   Sample Post:", posts[0]);
      }
    }

    // 2. Check Profiles
    console.log("\n2️⃣ Checking 'profiles' table accessibility...");
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .limit(5);

    if (profileError) {
       console.error("❌ FAILED to read 'profiles':", profileError.message);
    } else {
       console.log(`✅ Success! Found ${profiles.length} profiles.`);
    }

    // 3. Check Categories
    console.log("\n3️⃣ Checking 'categories' table...");
    const { data: categories, error: catError } = await supabase.from("categories").select("*").limit(5);

    if (catError) {
        console.error("❌ FAILED: ", catError.message);
    } else {
        console.log(`✅ Success! Found ${categories.length} categories.`);
    }

  } catch (err) {
    console.error("❌ UNEXPECTED ERROR:", err);
  }
}

runDiagnostics();
