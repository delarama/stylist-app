import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const ALLOWED_AMOUNTS = [10, 25, 50] as const;
type AllowedAmount = (typeof ALLOWED_AMOUNTS)[number];

export async function POST(request: Request) {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ ok: false, error: "NOT_SIGNED_IN" }, { status: 401 });
  }

  let amount: AllowedAmount;
  try {
    const body = await request.json();
    if (!ALLOWED_AMOUNTS.includes(body.amount)) {
      return NextResponse.json(
        { ok: false, error: "Amount must be 10, 25, or 50" },
        { status: 400 }
      );
    }
    amount = body.amount as AllowedAmount;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amount * 100,
          product_data: {
            name: `Wallet top-up — $${amount}`,
          },
        },
      },
    ],
    success_url: `${origin}/wallet?deposit_success=1`,
    cancel_url: `${origin}/wallet`,
    metadata: {
      user_id: user.id,
      amount_dollars: String(amount),
    },
    client_reference_id: user.id,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
