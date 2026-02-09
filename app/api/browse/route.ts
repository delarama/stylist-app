import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const supabase = await supabaseServer();

    // Query profiles table for stylists only
    const { data: stylists, error } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, is_stylist")
      .eq("is_stylist", true);

    if (error) {
      console.error("Error fetching stylists:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, stylists: stylists || [] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error in /api/browse:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
