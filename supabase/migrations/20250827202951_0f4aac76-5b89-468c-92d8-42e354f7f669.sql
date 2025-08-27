-- Fix security linter warning for function search path
CREATE OR REPLACE FUNCTION public.get_moment_media_url(moment_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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