import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: true, user: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        ok: true, 
        user: {
          id: user.id,
          email: user.email
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Never throw; always return JSON with ok: true
    console.error("Unexpected error in /api/me:", error);
    return NextResponse.json(
      { ok: true, user: null },
      { status: 200 }
    );
  }
}
