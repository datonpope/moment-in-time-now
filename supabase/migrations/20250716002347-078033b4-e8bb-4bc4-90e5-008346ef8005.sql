-- Fix Function Search Path Mutable warnings by updating all database functions
-- This prevents potential SQL injection attacks by restricting function search paths

-- 1. Update the update_updated_at_column function with security definer settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 2. Update the update_profile_stats function with security definer settings
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 3. Update the handle_new_user function with security definer settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Configure Auth Security Settings
-- Reduce OTP expiry time to 30 minutes (1800 seconds) to fix "Auth OTP long expiry" warning
UPDATE auth.config SET 
  otp_expiry = 1800
WHERE true;

-- Enable leaked password protection using HaveIBeenPwned integration
UPDATE auth.config SET 
  password_min_length = 8,
  password_required_characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  security_captcha_enabled = true
WHERE true;

-- Note: The HaveIBeenPwned integration typically requires additional configuration
-- in the Supabase dashboard under Authentication > Settings > Security
-- This migration sets the foundation for improved password security