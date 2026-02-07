import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { ok: false, error: "NOT_SIGNED_IN" },
        { status: 401 }
      );
    }

    // Query wallets table for the current user's minutes_balance
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("minutes_balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (walletError) {
      console.error("Error fetching wallet:", walletError);
      return NextResponse.json(
        { ok: false, error: walletError.message },
        { status: 500 }
      );
    }

    // Return 0 if no wallet record exists
    const minutes_balance = wallet?.minutes_balance ?? 0;

    return NextResponse.json(
      { ok: true, minutes_balance },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error in /api/wallet:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
