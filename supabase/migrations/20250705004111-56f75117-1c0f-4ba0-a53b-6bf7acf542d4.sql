-- Create storage buckets for moments
INSERT INTO storage.buckets (id, name, public) VALUES ('moments', 'moments', true);

-- Create moments table
CREATE TABLE public.moments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  capture_time INTEGER NOT NULL, -- seconds taken to capture
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  bluesky_uri TEXT, -- for bluesky integration
  is_published BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all published moments" 
ON public.moments 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Users can create their own moments" 
ON public.moments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own moments" 
ON public.moments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own moments" 
ON public.moments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_moments_updated_at
BEFORE UPDATE ON public.moments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for moments bucket
CREATE POLICY "Moments are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'moments');

CREATE POLICY "Users can upload their own moments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'moments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own moments" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'moments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own moments" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'moments' AND auth.uid()::text = (storage.foldername(name))[1]);