import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: Request) {
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

    const body = await request.json();
    const { stylist_id } = body;

    if (!stylist_id) {
      return NextResponse.json(
        { ok: false, error: "stylist_id is required" },
        { status: 400 }
      );
    }

    // Prevent users from chatting with themselves
    if (stylist_id === user.id) {
      return NextResponse.json(
        { ok: false, error: "Cannot chat with yourself" },
        { status: 400 }
      );
    }

    // Check if chat already exists
    const { data: existingChat, error: findError } = await supabase
      .from("chats")
      .select("id")
      .eq("user_id", user.id)
      .eq("stylist_id", stylist_id)
      .maybeSingle();

    if (findError) {
      console.error("Error finding existing chat:", findError);
      return NextResponse.json(
        { ok: false, error: findError.message },
        { status: 500 }
      );
    }

    if (existingChat) {
      return NextResponse.json(
        { ok: true, chat_id: existingChat.id },
        { status: 200 }
      );
    }

    // Create new chat
    const { data: newChat, error: createError } = await supabase
      .from("chats")
      .insert({
        user_id: user.id,
        stylist_id: stylist_id,
      })
      .select("id")
      .single();

    if (createError) {
      console.error("Error creating chat:", createError);
      return NextResponse.json(
        { ok: false, error: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, chat_id: newChat.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error in /api/chats/start:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
