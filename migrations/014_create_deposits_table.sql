CREATE TABLE IF NOT EXISTS public.deposits (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_session_id  text NOT NULL UNIQUE,
  amount             numeric(12, 2) NOT NULL CHECK (amount > 0),
  status             text NOT NULL DEFAULT 'pending',   -- pending | completed | failed
  created_at         timestamptz NOT NULL DEFAULT now(),
  completed_at       timestamptz
);

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deposits_read_own" ON public.deposits
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- RPC used by the Stripe webhook to credit a user's wallet atomically.
-- Uses INSERT ON CONFLICT to handle the case where the wallet row doesn't exist yet.
CREATE OR REPLACE FUNCTION public.increment_wallet_balance(
  p_user_id uuid,
  p_amount  numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallets (user_id, balance, minutes_balance)
  VALUES (p_user_id, p_amount, 0)
  ON CONFLICT (user_id) DO UPDATE
    SET balance = public.wallets.balance + EXCLUDED.balance;
END;
$$;
