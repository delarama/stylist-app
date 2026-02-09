-- Make specialties column nullable in profiles table
-- This allows profiles to exist without specialties set
ALTER TABLE public.profiles
ALTER COLUMN specialties DROP NOT NULL,
ALTER COLUMN specialties DROP DEFAULT;

-- Update existing rows with empty array to NULL
UPDATE public.profiles
SET specialties = NULL
WHERE specialties = '{}'::text[];
