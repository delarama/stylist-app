import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
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

    const resolvedParams = params instanceof Promise ? await params : params;
    const chatId = resolvedParams.id;

    const endedAt = new Date().toISOString();

    const { data, error } = await supabase.rpc("end_chat_and_charge", {
      p_chat_id: chatId,
      p_user_id: user.id,
      p_ended_at: endedAt,
    });

    if (error) {
      console.error("RPC error in end_chat_and_charge:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const result = data as {
      ok: boolean;
      error?: string;
      required?: number;
      available?: number;
      transaction_id?: string;
      total_amount?: number;
      stylist_cut?: number;
      platform_cut?: number;
      duration_minutes?: number;
      rate_per_minute?: number;
    };

    if (!result.ok) {
      switch (result.error) {
        case "CHAT_NOT_FOUND":
          return NextResponse.json(result, { status: 404 });
        case "NOT_AUTHORIZED":
          return NextResponse.json(result, { status: 403 });
        case "CHAT_ALREADY_ENDED":
          return NextResponse.json(result, { status: 409 });
        case "INSUFFICIENT_BALANCE":
          return NextResponse.json(result, { status: 402 });
        default:
          return NextResponse.json(result, { status: 500 });
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error in /api/chats/[id]/end:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
