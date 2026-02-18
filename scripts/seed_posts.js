import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mojldcnsahwpdcrzawgq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vamxkY25zYWh3cGRjcnphd2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODg4OTUsImV4cCI6MjA4NjQ2NDg5NX0.sk4tUpR5zGU74ejoRerOx_CzWFVxJpbILdV3XErZ3mE";

if (!supabaseUrl || !supabaseKey) {
    console.log("Credentials not found in env, attempting to read .env file manually...");
    // In a real scenario we'd use dotenv properly, but here we might fail if not set.
    // relying on user to have .env
}

const supabase = createClient(supabaseUrl, supabaseKey);

const samplePosts = [
  {
    title: "The Future of Luxury Travel",
    excerpt: "Explore the upcoming trends in high-end tourism and what it means for the globetrotter.",
    content: "Full content here...",
    category: "Travel",
    status: "published",
    cover_image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    author_name: "Admin"
  },
  {
    title: "Modern Minimalist Interior Design",
    excerpt: "Why less is more when it comes to crafting the perfect living space.",
    content: "Full content here...",
    category: "Design",
    status: "published",
    cover_image: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&q=80",
    author_name: "Admin"
  },
  {
    title: "Culinary Delights of Paris",
    excerpt: "A guide to the hidden gems of French cuisine.",
    content: "Full content here...",
    category: "Food",
    status: "published",
    cover_image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    author_name: "Admin"
  },
  {
    title: "Eco-Friendly Fashion Brands",
    excerpt: "Sustainable luxury is the new black. Discover brands making a difference.",
    content: "Full content here...",
    category: "Fashion",
    status: "published",
    cover_image: "https://images.unsplash.com/photo-1529720317453-c8da503f2051?w=800&q=80",
    author_name: "Admin"
  },
  {
    title: "Unpublished Draft",
    excerpt: "This should not appear.",
    content: "Hidden content.",
    category: "Tech",
    status: "draft",
    cover_image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    author_name: "Admin"
  }
];

async function seed() {
    console.log("🌱 Seeding Blog Posts...");
    
    for (const post of samplePosts) {
        const { error } = await supabase.from('blog_posts').insert([post]);
        if (error) {
            console.error(`❌ Failed to insert ${post.title}:`, error.message);
        } else {
            console.log(`✅ Inserted: ${post.title}`);
        }
    }
    console.log("✨ Seeding Complete.");
}

seed();
