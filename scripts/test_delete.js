
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

async function testDelete() {
  console.log(`🔐 Signing in as ${adminEmail}...`);

  const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (authError) {
    console.error("❌ Login failed:", authError.message);
    return;
  }

  console.log(`✅ Logged in.`);

  // 1. Create a dummy post
  console.log("📝 Creating dummy post...");
  const slug = `test-delete-${Date.now()}`;
  const { data: post, error: createError } = await supabase
    .from("blog_posts")
    .insert([{
        title: "Test Delete Post",
        content: "This post should be deleted.",
        excerpt: "To be deleted",
        status: "draft",
        author_name: "Admin User",
        slug: slug
    }])
    .select()
    .single();

  if (createError) {
      console.error("❌ Failed to create post:", createError.message);
      return;
  }

  console.log(`✅ Post created. ID: ${post.id}`);

  // 2. Delete the post
  console.log("🗑️ Attempting to delete post...");
  const { error: deleteError } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", post.id);

  if (deleteError) {
      console.error("❌ Failed to delete post:", deleteError.message);
  } else {
      console.log("✅ Post deleted successfully!");
  }
}

testDelete();
