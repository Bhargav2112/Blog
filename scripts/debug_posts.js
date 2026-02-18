import { createClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import fs from 'fs';
import path from 'path';

// Manual .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) return {};
        const envContent = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const [key, val] = line.split('=');
            if (key && val) env[key.trim()] = val.trim().replace(/^["']|["']$/g, '');
        });
        return env;
    } catch (e) {
        return {};
    }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ MISSING ENV VARS. Please run with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    console.log("🔍 Debugging Blog Posts...");

    // 1. Check Connection
    const { data: health, error: healthError } = await supabase.from('blog_posts').select('count', { count: 'exact', head: true });
    
    if (healthError) {
        console.error("❌ Connection/RLS Error on HEAD:", healthError);
    } else {
        console.log("✅ Connection OK. Total posts (HEAD):", health);
    }

    // 2. Fetch all posts (raw)
    const { data: rawPosts, error: rawError } = await supabase.from('blog_posts').select('*').limit(5);
    if (rawError) {
        console.error("❌ Fetch Error:", rawError);
    } else {
        console.log(`✅ Raw Fetch Success. Got ${rawPosts.length} posts.`);
        if (rawPosts.length > 0) {
            console.log("Sample Post Status:", rawPosts[0].status);
        } else {
            console.warn("⚠️ No posts found in DB. Table is empty.");
        }
    }

    // 3. Test exact query used in app
    console.log("\n🧪 Testing App Query (status='published')...");
    const { data: appPosts, error: appError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .limit(5);

    if (appError) {
        console.error("❌ App Query Error:", appError);
    } else {
        console.log(`✅ App Query Success. Got ${appPosts.length} published posts.`);
    }
}

debug();
