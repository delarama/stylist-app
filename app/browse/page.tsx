import { supabaseServer } from "@/lib/supabaseServer";
import { StylistBrowseClient } from "../BrowseClient";
import { type Stylist } from "../../figma-redesign/src/app/components/stylist-browse";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

async function getInitialStylists() {
  const supabase = await supabaseServer();
  
  // Fetch profiles - only show stylists (is_stylist = true)
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name, headline, avatar_url, specialties, rate_per_minute, created_at")
    .eq("is_stylist", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (profilesError || !profiles) {
    return { stylists: [], error: profilesError?.message || null };
  }

  const items = profiles.filter((p: any) => !!p.id);
  
  if (items.length === 0) {
    return { stylists: [], error: null };
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

  // Map to Stylist interface
  const stylists: Stylist[] = items.map((profile: any) => {
    const id = String(profile.id);
    const stats = statsMap.get(id);
    return {
      id: profile.id,
      name: profile.display_name || "Unnamed stylist",
      specialty: profile.headline || "Beauty · Fashion",
      image: profile.avatar_url || null,
      rating: stats?.avg_rating ?? null,
      reviews: stats?.review_count ?? null,
      specialties: profile.specialties ?? [],
      ratePerMinute: profile.rate_per_minute ?? null,
      verified: false,
      tags: undefined,
    };
  });

  return { stylists, error: null };
}

export default async function BrowsePage() {
  const { stylists, error } = await getInitialStylists();

  return (
    <StylistBrowseClient
      initialStylists={stylists}
      initialError={error}
    />
  );
}
