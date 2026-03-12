import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const supabase = await supabaseServer();
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");

    // Build query for stylists only (is_stylist = true)
    let query = supabase
      .from("profiles")
      .select("id, display_name, headline, avatar_url, specialties")
      .eq("is_stylist", true);

    // Filter by specialty keyword against headline
    if (specialty) {
      query = query.ilike("headline", `%${specialty}%`);
    }

    const { data: profiles, error: profilesError } = await query
      .order("created_at", { ascending: false })
      .limit(20);

    if (profilesError) {
      console.error("Error fetching stylists:", profilesError);
      return NextResponse.json(
        { ok: false, error: profilesError.message },
        { status: 500 }
      );
    }

    const items = (profiles || []).filter((p: any) => !!p.id);
    
    if (items.length === 0) {
      return NextResponse.json(
        { ok: true, stylists: [] },
        { status: 200 }
      );
    }

    // LEFT JOIN: Fetch review stats for all stylists
    const stylistIds = items.map((p: any) => String(p.id));
    const { data: stats } = await supabase
      .from("stylist_review_stats")
      .select("stylist_id, review_count, avg_rating")
      .in("stylist_id", stylistIds);

    // Create a map of stats by stylist_id for efficient lookup
    const statsMap = new Map();
    stats?.forEach((stat: any) => {
      statsMap.set(stat.stylist_id, {
        review_count: stat.review_count ?? null,
        avg_rating: stat.avg_rating ?? null,
      });
    });

    // Merge profiles with stats
    const stylistsWithStats = items.map((profile: any) => {
      const id = String(profile.id);
      const stats = statsMap.get(id);
      return {
        id: profile.id,
        display_name: profile.display_name,
        headline: profile.headline,
        avatar_url: profile.avatar_url,
        avg_rating: stats?.avg_rating ?? null,
        review_count: stats?.review_count ?? null,
      };
    });

    return NextResponse.json(
      { ok: true, stylists: stylistsWithStats },
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
