import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ ok: false, error: "NOT_SIGNED_IN" }, { status: 401 });
  }

  const [{ data: deposits }, { data: payments }] = await Promise.all([
    supabase
      .from("deposits")
      .select("id, amount, status, created_at")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false }),
    supabase
      .from("transactions")
      .select("id, total_amount, type, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const depositEntries = (deposits ?? []).map((d) => ({
    id: d.id,
    type: "deposit" as const,
    amount: Number(d.amount),
    created_at: d.created_at,
    description: "Wallet top-up",
  }));

  const paymentEntries = (payments ?? []).map((t) => ({
    id: t.id,
    type: t.type as "chat_payment" | "refund",
    amount: Number(t.total_amount),
    created_at: t.created_at,
    description: t.type === "refund" ? "Refund" : "Chat session",
  }));

  const all = [...depositEntries, ...paymentEntries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return NextResponse.json({ ok: true, entries: all });
}
