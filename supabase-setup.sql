-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  categoria TEXT,
  dificultad TEXT,
  tiempo TEXT,
  porciones TEXT,
  ingredientes TEXT[],
  preparacion TEXT[],
  imagenes_locales TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  contenido TEXT NOT NULL,
  categoria TEXT,
  fecha DATE DEFAULT NOW(),
  imagen_destacada TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('recipe-images', 'recipe-images', true) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for recipes
CREATE POLICY "Anyone can view recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert recipes" ON recipes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own recipes" ON recipes FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete their own recipes" ON recipes FOR DELETE USING (created_by = auth.uid());

-- Policies for categories
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can manage categories" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for blog posts
CREATE POLICY "Anyone can view blog posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert blog posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own blog posts" ON blog_posts FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete their own blog posts" ON blog_posts FOR DELETE USING (created_by = auth.uid());

-- Storage policies
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-images');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');
