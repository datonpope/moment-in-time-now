-- Add performance indexes for better query performance

-- Index for moments table - most common queries
CREATE INDEX IF NOT EXISTS idx_moments_published_created 
  ON public.moments (is_published, created_at DESC) 
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_moments_user_created 
  ON public.moments (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_moments_capture_time 
  ON public.moments (capture_time);

-- Index for interactions table - most common queries
CREATE INDEX IF NOT EXISTS idx_interactions_moment_type 
  ON public.interactions (moment_id, type);

CREATE INDEX IF NOT EXISTS idx_interactions_user_moment 
  ON public.interactions (user_id, moment_id);

CREATE INDEX IF NOT EXISTS idx_interactions_created 
  ON public.interactions (created_at DESC);

-- Index for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_user_id 
  ON public.profiles (user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_display_name 
  ON public.profiles (display_name) 
  WHERE display_name IS NOT NULL;

-- Composite index for common joins
CREATE INDEX IF NOT EXISTS idx_moments_profiles_join 
  ON public.moments (user_id, is_published, created_at DESC) 
  WHERE is_published = true;

-- Enable real-time for better performance
ALTER TABLE public.moments REPLICA IDENTITY FULL;
ALTER TABLE public.interactions REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.moments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;