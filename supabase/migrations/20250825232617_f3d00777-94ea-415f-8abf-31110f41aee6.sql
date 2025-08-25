-- Security fixes for moments, interactions, and storage

-- 1. Add privacy control to moments table
ALTER TABLE public.moments ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false;

-- 2. Update moments RLS policies to respect privacy and add missing owner access
DROP POLICY IF EXISTS "Users can view all published moments" ON public.moments;
DROP POLICY IF EXISTS "Users can update their own moments" ON public.moments;

-- Allow users to view their own moments (including private ones)
CREATE POLICY "Users can view their own moments" 
ON public.moments 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to view public moments from others
CREATE POLICY "Users can view public moments" 
ON public.moments 
FOR SELECT 
USING (is_published = true AND is_private = false);

-- Add WITH CHECK to update policy for security
CREATE POLICY "Users can update their own moments" 
ON public.moments 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Restrict interactions to be visible only to relevant users
DROP POLICY IF EXISTS "Anyone can view interactions" ON public.interactions;

-- Users can view interactions on their own moments
CREATE POLICY "Users can view interactions on their moments" 
ON public.interactions 
FOR SELECT 
USING (
  moment_id IN (
    SELECT id FROM public.moments WHERE user_id = auth.uid()
  )
);

-- Users can view interactions on public moments
CREATE POLICY "Users can view interactions on public moments" 
ON public.interactions 
FOR SELECT 
USING (
  moment_id IN (
    SELECT id FROM public.moments 
    WHERE is_published = true AND is_private = false
  )
);

-- Users can view their own interactions
CREATE POLICY "Users can view their own interactions" 
ON public.interactions 
FOR SELECT 
USING (user_id = auth.uid());

-- 4. Add WITH CHECK to interactions update policy
DROP POLICY IF EXISTS "Users can update their own interactions" ON public.interactions;
CREATE POLICY "Users can update their own interactions" 
ON public.interactions 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 5. Tighten storage policies for moments bucket
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view moments media" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload moments media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own moments media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own moments media" ON storage.objects;

-- Create secure storage policies for moments bucket
CREATE POLICY "Users can view their own moments media" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'moments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view media for public moments
CREATE POLICY "Users can view public moments media" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'moments' AND 
  EXISTS (
    SELECT 1 FROM public.moments 
    WHERE media_url LIKE '%' || name 
    AND is_published = true 
    AND is_private = false
  )
);

-- Upload policy for moments
CREATE POLICY "Users can upload their own moments media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'moments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Update policy for moments
CREATE POLICY "Users can update their own moments media" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'moments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'moments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Delete policy for moments
CREATE POLICY "Users can delete their own moments media" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'moments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Add constraints for user-managed fields
ALTER TABLE public.profiles 
ADD CONSTRAINT check_display_name_length 
CHECK (length(display_name) <= 100);

ALTER TABLE public.profiles 
ADD CONSTRAINT check_bio_length 
CHECK (length(bio) <= 500);

ALTER TABLE public.profiles 
ADD CONSTRAINT check_website_format 
CHECK (website IS NULL OR website ~ '^https?://');

ALTER TABLE public.moments 
ADD CONSTRAINT check_content_length 
CHECK (length(content) <= 2000);

ALTER TABLE public.interactions 
ADD CONSTRAINT check_interaction_content_length 
CHECK (content IS NULL OR length(content) <= 1000);