-- Create post_images bucket if it doesn't exist
-- Note: Bucket creation must be done via Supabase Dashboard or API
-- This file documents the required policies

-- Storage policies for post_images bucket
-- These allow authenticated users to upload and everyone to read (for public feed)

-- Policy: Allow authenticated users to upload their own images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload post images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to read all post images (for feed)
CREATE POLICY IF NOT EXISTS "Authenticated users can read post images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'post_images');

-- Policy: Allow public read access (for public feed images)
-- Uncomment if you want public access without authentication
-- CREATE POLICY IF NOT EXISTS "Public can read post images"
-- ON storage.objects
-- FOR SELECT
-- TO public
-- USING (bucket_id = 'post_images');

-- Policy: Allow authenticated users to delete their own images
CREATE POLICY IF NOT EXISTS "Users can delete their own post images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'post_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
