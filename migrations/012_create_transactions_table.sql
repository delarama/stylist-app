CREATE TYPE public.transaction_type AS ENUM ('chat_payment', 'deposit', 'refund');

CREATE TABLE IF NOT EXISTS public.transactions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id        uuid REFERENCES public.chats(id) ON DELETE SET NULL,
  user_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stylist_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_amount   numeric(12, 2) NOT NULL CHECK (total_amount >= 0),
  stylist_cut    numeric(12, 2) NOT NULL CHECK (stylist_cut >= 0),
  platform_cut   numeric(12, 2) NOT NULL CHECK (platform_cut >= 0),
  type           public.transaction_type NOT NULL DEFAULT 'chat_payment',
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_read_as_user" ON public.transactions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "transactions_read_as_stylist" ON public.transactions
  FOR SELECT TO authenticated USING (stylist_id = auth.uid());
