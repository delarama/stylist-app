ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS rate_per_minute numeric(10, 2) DEFAULT NULL;
