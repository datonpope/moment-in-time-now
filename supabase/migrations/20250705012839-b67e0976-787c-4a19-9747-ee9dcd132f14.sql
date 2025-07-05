-- Fix the relationship between moments and profiles tables
-- Add foreign key constraint to establish proper relationship
ALTER TABLE public.moments 
ADD CONSTRAINT fk_moments_user_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_moments_user_id ON public.moments(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Enable realtime for moments table
ALTER TABLE public.moments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.moments;

-- Enable realtime for profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;