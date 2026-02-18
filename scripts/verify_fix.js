
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("🔍 Verifying RLS Fix...");

  // 1. Try to fetch profiles (was causing recursion)
  console.log("1. Testing Profiles access...");
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("count", { count: "exact", head: true });

  if (profileError) {
    console.error("❌ Profiles fetch FAILED:", profileError.message);
  } else {
    console.log(`✅ Profiles fetch SUCCESS. Count: ${profiles}`);
  }

  // 2. Try to fetch posts (public access)
  console.log("2. Testing Blog Posts access...");
  const { data: posts, error: postsError } = await supabase
    .from("blog_posts")
    .select("id, title, status");
  
  if (postsError) {
    console.error("❌ Blog Posts fetch FAILED:", postsError.message);
  } else {
    console.log(`✅ Blog Posts fetch SUCCESS. Retrieved ${posts.length} posts.`);
    if (posts.length > 0) {
        console.log("Sample Post:", posts[0].title);
    } else {
        console.warn("⚠️ No posts found. Did you seed the database?");
    }
  }
}

verify();
