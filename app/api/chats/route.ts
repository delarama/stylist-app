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

    // Fetch chats for the current user, ordered by created_at
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select("id, user_id, stylist_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (chatsError) {
      console.error("Error fetching chats:", chatsError);
      return NextResponse.json(
        { ok: false, error: chatsError.message, details: chatsError },
        { status: 500 }
      );
    }

    if (!chats) {
      return NextResponse.json(
        { ok: false, error: "Chats data is null" },
        { status: 500 }
      );
    }

    // Extract stylist_ids to fetch their profiles
    const stylistIds = [...new Set(chats.map((chat) => chat.stylist_id))];

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, headline, avatar_url")
      .in("id", stylistIds);

    if (profilesError) {
      console.error("Error fetching stylist profiles:", profilesError);
      // Continue without stylist data if profiles fetch fails, but log the error
      // Or return an error if stylist data is critical
    }

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    const chatsWithStylistInfo = chats.map((chat) => ({
      ...chat,
      stylist: profileMap.get(chat.stylist_id) || null,
    }));

    return NextResponse.json(
      { ok: true, chats: chatsWithStylistInfo },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error in /api/chats:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
