-- GRAND FIX V3.1: COMPLETE SCHEMA RESTORATION
-- Run this script to fix "0 Articles" and "Checking..." hangs.

-- 1. CLEANUP (Drop Everything to Remove Conflicts/Loops)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
-- We do NOT drop auth.users, but we fix profiles.
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. TABLE: PROFILES (Critical for Auth & RLS)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. TABLE: CATEGORIES
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view categories" ON categories FOR SELECT USING (true);

-- 4. TABLE: BLOG POSTS
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  status TEXT DEFAULT 'published',
  views INTEGER DEFAULT 0,
  author_name TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Public read
CREATE POLICY "Public can read published posts"
ON blog_posts FOR SELECT
USING (status = 'published');

-- Policy: Admin full access
CREATE POLICY "Admin full access"
ON blog_posts FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. TABLE: CONTACT MESSAGES
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public send messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read messages" ON contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. PERMISSIONS
GRANT SELECT ON categories, blog_posts, profiles TO anon, authenticated;
GRANT INSERT ON contact_messages TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 7. SEED CATEGORIES
INSERT INTO categories (name, slug) VALUES
('Travel', 'travel'),
('Design', 'design'),
('Food', 'food'),
('Fashion', 'fashion'),
('Tech', 'tech')
ON CONFLICT DO NOTHING;

-- 8. SEED BLOG POSTS (100 Items)
INSERT INTO blog_posts (title, slug, excerpt, content, category, status, cover_image, created_at, views)
SELECT
  'Luxe Post #' || i,
  'luxe-post-' || i,
  'This is a seeded luxury blog post number ' || i || '. It features premium content and elegant design.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  CASE WHEN i % 4 = 0 THEN 'Travel' WHEN i % 4 = 1 THEN 'Design' WHEN i % 4 = 2 THEN 'Food' ELSE 'Fashion' END,
  'published',
  'https://images.unsplash.com/photo-' || (CASE WHEN i % 4 = 0 THEN '1542314831-068cd1dbfeeb' WHEN i % 4 = 1 THEN '1616047006789-b7af5afb8c20' WHEN i % 4 = 2 THEN '1550547660-d9450f859349' ELSE '1529720317453-c8da503f2051' END) || '?w=800&q=80',
  NOW() - (i || ' days')::INTERVAL,
  floor(random() * 1000 + 1)::int
FROM generate_series(1, 100) AS i;
