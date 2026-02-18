
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

const CATEGORIES = ["Tech", "Design", "Lifestyle", "Travel", "Food", "Business"];
const AUTHORS = ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Ethan Hunt"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Date.now();
}

function generatePost(index) {
  const title = `Insightful Article #${index + 1}: ${randomItem([
    "The Future of AI",
    "Mastering React",
    "Design Trends 2026",
    "Sustainable Living",
    "Remote Work Tips",
    "Global Economics",
  ])}`;
  
  return {
    title: title,
    slug: generateSlug(title),
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>",
    cover_image: `https://images.unsplash.com/photo-${randomItem([
        "1499750310107-5fef28a66643", 
        "1486312338219-ce68d2c6f44d", 
        "1451187580459-43490279c0fa",
        "1501504905252-473c47e087f8",
        "1454165804606-c3d57bc86b40"
    ])}?w=800&q=80`,
    category: randomItem(CATEGORIES),
    author_name: randomItem(AUTHORS),
    views: randomInt(0, 5000),
    status: "published",
    created_date: new Date(Date.now() - randomInt(0, 10000000000)).toISOString(),
    reading_time: randomInt(3, 15)
  };
}

async function seed() {
  console.log("Starting seed process...");

  const posts = [];
  for (let i = 0; i < 100; i++) {
    posts.push(generatePost(i));
  }

  // Insert in batches
  const batchSize = 10;
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    const { error } = await supabase.from("blog_posts").insert(batch);
    
    if (error) {
      console.error("Error inserting batch:", error);
    } else {
      console.log(`Inserted posts ${i + 1} to ${i + batch.length}`);
    }
  }

  console.log("Seeding complete!");
}

seed();
