ALTER TABLE public.wallets
ADD COLUMN IF NOT EXISTS balance numeric(12, 2) NOT NULL DEFAULT 0.00;

ALTER TABLE public.wallets
ADD CONSTRAINT wallets_balance_non_negative CHECK (balance >= 0);
