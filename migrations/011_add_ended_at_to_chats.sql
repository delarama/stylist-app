ALTER TABLE public.chats
ADD COLUMN IF NOT EXISTS ended_at timestamptz DEFAULT NULL;
