-- Create Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author TEXT,
    published BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create Public Read Policy
DROP POLICY IF EXISTS "Public Read Blog Posts" ON public.blog_posts;
CREATE POLICY "Public Read Blog Posts" ON public.blog_posts FOR SELECT USING (true);

-- Insert a sample post so it's not empty
INSERT INTO public.blog_posts (title, slug, content, excerpt, author, published)
VALUES (
    'Welcome to RichPredict Blog', 
    'welcome-to-richpredict', 
    'Welcome to our the most accurate sports prediction blog. We provide AI-powered analytics for football, tennis and more.', 
    'The official launch of RichPredict AI analytics blog.', 
    'Admin', 
    true
) ON CONFLICT (slug) DO NOTHING;
