-- Add more fields to profiles table for enhanced user profiles
ALTER TABLE public.profiles 
ADD COLUMN bio TEXT,
ADD COLUMN website TEXT,
ADD COLUMN location TEXT,
ADD COLUMN bluesky_handle TEXT,
ADD COLUMN bluesky_did TEXT,
ADD COLUMN is_verified BOOLEAN DEFAULT false,
ADD COLUMN follower_count INTEGER DEFAULT 0,
ADD COLUMN following_count INTEGER DEFAULT 0,
ADD COLUMN moments_count INTEGER DEFAULT 0;

-- Create a function to update profile stats
CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update moments count
  UPDATE public.profiles 
  SET moments_count = (
    SELECT COUNT(*) 
    FROM public.moments 
    WHERE user_id = NEW.user_id AND is_published = true
  )
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update profile stats
CREATE TRIGGER update_profile_moments_count
  AFTER INSERT OR UPDATE OR DELETE ON public.moments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_stats();