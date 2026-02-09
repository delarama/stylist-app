-- Add is_stylist and specialties columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_stylist boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS specialties text[] DEFAULT '{}';

-- Add index on is_stylist for faster filtering
CREATE INDEX IF NOT EXISTS idx_profiles_is_stylist ON public.profiles(is_stylist);

-- Add GIN index on specialties array for efficient array queries
CREATE INDEX IF NOT EXISTS idx_profiles_specialties ON public.profiles USING GIN(specialties);
