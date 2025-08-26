-- Fix critical security issues

-- 1. Make moments storage bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'moments';

-- 2. Fix interaction RLS policy to prevent user_id spoofing
DROP POLICY IF EXISTS "Users can create their own interactions" ON public.interactions;

CREATE POLICY "Users can create their own interactions" 
ON public.interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Create secure storage policies for private moments bucket
CREATE POLICY "Users can view their own moment files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'moments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own moment files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'moments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own moment files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'moments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own moment files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'moments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Update moments table default values for better security
ALTER TABLE public.moments 
ALTER COLUMN is_private SET DEFAULT true;

-- 5. Add file validation constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT avatar_url_format 
CHECK (avatar_url IS NULL OR avatar_url ~ '^https://[^/]+\.supabase\.co/storage/v1/object/public/avatars/');

-- 6. Create function to get signed URLs for private moment media
CREATE OR REPLACE FUNCTION public.get_moment_media_url(moment_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  media_path text;
  signed_url text;
BEGIN
  -- Get the media_url for the moment (only if user owns it or it's public)
  SELECT media_url INTO media_path
  FROM public.moments 
  WHERE id = moment_id 
  AND (user_id = auth.uid() OR (is_published = true AND is_private = false));
  
  IF media_path IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Extract the path from the full URL for signing
  media_path := regexp_replace(media_path, '^.*/storage/v1/object/[^/]+/moments/', '');
  
  -- This would normally call Supabase's sign function, but for now return the path
  -- In practice, this should use supabase.storage.from('moments').createSignedUrl()
  RETURN media_path;
END;
$$;