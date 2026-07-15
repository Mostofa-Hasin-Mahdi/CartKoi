-- Migration: 04_storage_buckets.sql

-- 1. Create a public bucket for menu item images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cart_images', 'cart_images', true) 
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to prevent conflict
DROP POLICY IF EXISTS "Anyone can view cart images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload cart images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update cart images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete cart images" ON storage.objects;

-- 3. Set up Row Level Security (RLS) for the bucket

-- Allow public viewing of files in the cart_images bucket
CREATE POLICY "Anyone can view cart images" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'cart_images' );

-- Allow authenticated users to upload files to the cart_images bucket
CREATE POLICY "Authenticated users can upload cart images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'cart_images' );

-- Allow authenticated users to update files they own in the cart_images bucket
CREATE POLICY "Authenticated users can update cart images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'cart_images' );

-- Allow authenticated users to delete files they own in the cart_images bucket
CREATE POLICY "Authenticated users can delete cart images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'cart_images' );
