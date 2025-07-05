-- Create interactions table for likes and comments
CREATE TABLE public.interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  moment_id UUID NOT NULL REFERENCES public.moments(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment')),
  content TEXT, -- null for likes, contains text for comments
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index for likes only (one like per user per moment)
CREATE UNIQUE INDEX idx_unique_likes 
ON public.interactions (user_id, moment_id) 
WHERE type = 'like';

-- Enable RLS
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view interactions" 
ON public.interactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own interactions" 
ON public.interactions 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own interactions" 
ON public.interactions 
FOR UPDATE 
USING (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own interactions" 
ON public.interactions 
FOR DELETE 
USING (user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid()));

-- Add indexes for performance
CREATE INDEX idx_interactions_moment_id ON public.interactions(moment_id);
CREATE INDEX idx_interactions_user_id ON public.interactions(user_id);
CREATE INDEX idx_interactions_type ON public.interactions(type);

-- Add trigger for timestamps
CREATE TRIGGER update_interactions_updated_at
BEFORE UPDATE ON public.interactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for interactions
ALTER TABLE public.interactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interactions;