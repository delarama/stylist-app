CREATE OR REPLACE FUNCTION public.end_chat_and_charge(
  p_chat_id  uuid,
  p_user_id  uuid,
  p_ended_at timestamptz
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_chat            record;
  v_rate            numeric(10, 2);
  v_duration_min    int;
  v_total_cost      numeric(12, 2);
  v_stylist_cut     numeric(12, 2);
  v_platform_cut    numeric(12, 2);
  v_user_balance    numeric(12, 2);
  v_transaction_id  uuid;
BEGIN
  -- Lock the chat row to prevent race conditions
  SELECT id, user_id, stylist_id, created_at, ended_at
  INTO v_chat
  FROM public.chats
  WHERE id = p_chat_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'CHAT_NOT_FOUND');
  END IF;

  -- Verify caller is the chat's user
  IF v_chat.user_id <> p_user_id THEN
    RETURN jsonb_build_object('ok', false, 'error', 'NOT_AUTHORIZED');
  END IF;

  -- Guard against double-charging
  IF v_chat.ended_at IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'CHAT_ALREADY_ENDED');
  END IF;

  -- Fetch stylist's rate (NULL = free)
  SELECT COALESCE(rate_per_minute, 0.00)
  INTO v_rate
  FROM public.profiles
  WHERE id = v_chat.stylist_id;

  -- Calculate duration in whole minutes (minimum 1)
  v_duration_min := GREATEST(
    CEIL(EXTRACT(EPOCH FROM (p_ended_at - v_chat.created_at)) / 60.0)::int,
    1
  );

  v_total_cost   := v_duration_min * v_rate;
  v_stylist_cut  := ROUND(v_total_cost * 0.70, 2);
  v_platform_cut := v_total_cost - v_stylist_cut;

  -- Check user balance (lock wallet row)
  SELECT COALESCE(balance, 0.00)
  INTO v_user_balance
  FROM public.wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_user_balance IS NULL THEN
    v_user_balance := 0.00;
  END IF;

  IF v_total_cost > 0 AND v_user_balance < v_total_cost THEN
    RETURN jsonb_build_object(
      'ok',        false,
      'error',     'INSUFFICIENT_BALANCE',
      'required',  v_total_cost,
      'available', v_user_balance
    );
  END IF;

  -- Deduct from user wallet (only if cost > 0)
  IF v_total_cost > 0 THEN
    UPDATE public.wallets
    SET balance = balance - v_total_cost
    WHERE user_id = p_user_id;

    -- Credit stylist wallet (upsert in case no row exists)
    INSERT INTO public.wallets (user_id, balance, minutes_balance)
    VALUES (v_chat.stylist_id, v_stylist_cut, 0)
    ON CONFLICT (user_id) DO UPDATE
      SET balance = public.wallets.balance + EXCLUDED.balance;
  END IF;

  -- Insert transaction record
  INSERT INTO public.transactions
    (chat_id, user_id, stylist_id, total_amount, stylist_cut, platform_cut, type)
  VALUES
    (p_chat_id, p_user_id, v_chat.stylist_id, v_total_cost, v_stylist_cut, v_platform_cut, 'chat_payment')
  RETURNING id INTO v_transaction_id;

  -- Mark chat as ended
  UPDATE public.chats
  SET ended_at = p_ended_at
  WHERE id = p_chat_id;

  RETURN jsonb_build_object(
    'ok',               true,
    'transaction_id',   v_transaction_id,
    'total_amount',     v_total_cost,
    'stylist_cut',      v_stylist_cut,
    'platform_cut',     v_platform_cut,
    'duration_minutes', v_duration_min,
    'rate_per_minute',  v_rate
  );
END;
$$;
