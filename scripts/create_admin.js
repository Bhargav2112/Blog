
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const adminEmail = process.env.VITE_ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseKey || !adminEmail || !adminPassword) {
  console.error("❌ Missing environment variables. Check .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  console.log(`⏳ Creating admin user: ${adminEmail}...`);

  const { data, error } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword,
    options: {
        data: {
            full_name: "Admin User",
            role: "admin" // This metadata might be used by triggers, but our AuthContext also checks the email
        }
    }
  });

  if (error) {
    console.error("❌ Error creating user:", error.message);
  } else {
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        console.log("⚠️ User already exists.");
    } else {
        console.log("✅ Admin user created successfully!");
        console.log("   Email:", adminEmail);
        console.log("   Password:", adminPassword);
    }
  }
}

createAdmin();
