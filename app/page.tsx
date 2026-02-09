import { supabaseServer } from "@/lib/supabaseServer";
import { StylistBrowseClient } from "./BrowseClient";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

async function getProfilesWithStats() {
  const supabase = await supabaseServer();
  
  // Fetch profiles - only show stylists (is_stylist = true)
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name, headline, avatar_url, created_at, specialties")
    .eq("is_stylist", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (profilesError || !profiles) {
    return { profiles: [], error: profilesError };
  }

  const items = profiles.filter((p: any) => !!p.id);
  
  if (items.length === 0) {
    return { profiles: [], error: null };
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

  // LEFT JOIN: Merge profiles with stats
  const profilesWithStats = items.map((profile: any) => {
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

  return { profiles: profilesWithStats, error: null };
}

export default async function BrowsePage() {
  const { profiles: items, error } = await getProfilesWithStats();

  // Map to Figma component's Stylist interface
  const stylists = items.map((p: any) => ({
    id: p.id,
    name: p.display_name || "Unnamed stylist",
    specialty: p.headline || "Beauty · Fashion",
    image: p.avatar_url || null,
    rating: p.avg_rating ?? null,
    reviews: p.review_count ?? null,
    location: undefined, // Not available in current schema
    price: undefined, // Not available in current schema
    verified: false, // Not available in current schema
    tags: undefined, // Not available in current schema
  }));

  return (
    <StylistBrowseClient
      stylists={stylists}
      error={error?.message || null}
    />
  );
}
