import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const amountDollars = session.metadata?.amount_dollars;

    if (!userId || !amountDollars) {
      console.error("Webhook missing metadata:", session.metadata);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const amount = parseFloat(amountDollars);
    const stripeSessionId = session.id;

    // Idempotency guard — skip if already processed
    const { data: existing } = await supabaseAdmin
      .from("deposits")
      .select("id")
      .eq("stripe_session_id", stripeSessionId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ received: true });
    }

    // Record the deposit
    const { error: depositError } = await supabaseAdmin.from("deposits").insert({
      user_id: userId,
      stripe_session_id: stripeSessionId,
      amount,
      status: "completed",
      completed_at: new Date().toISOString(),
    });

    if (depositError) {
      console.error("Failed to insert deposit:", depositError);
      return NextResponse.json({ error: "Failed to record deposit" }, { status: 500 });
    }

    // Credit the wallet atomically (upserts if no row exists yet)
    const { error: walletError } = await supabaseAdmin.rpc("increment_wallet_balance", {
      p_user_id: userId,
      p_amount: amount,
    });

    if (walletError) {
      console.error("Failed to update wallet balance:", walletError);
      return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
