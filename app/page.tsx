import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import { Search, SlidersHorizontal, Star, MapPin, Award } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

async function getProfilesWithStats() {
  const supabase = await supabaseServer();
  
  // Fetch profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name, headline, avatar_url, created_at")
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

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="size-3 sm:size-4 fill-amber-400 text-amber-400" />
      ))}
      {hasHalfStar && (
        <Star className="size-3 sm:size-4 fill-amber-400 text-amber-400" />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="size-3 sm:size-4 text-muted-foreground" />
      ))}
    </div>
  );
}

export default async function BrowsePage() {
  const { profiles: items, error } = await getProfilesWithStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8 sm:py-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl tracking-tight mb-1 sm:mb-2">Find Your Stylist</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Discover talented professionals near you</p>
              </div>
              <Button variant="outline" size="default" className="hidden sm:flex gap-2">
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-muted-foreground" />
              <Input 
                placeholder="Search by name, specialty, or location..." 
                className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base bg-background border-border/50 w-full"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
              <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap text-xs sm:text-sm">
                All Stylists
              </Badge>
              <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer hover:bg-secondary transition-colors whitespace-nowrap text-xs sm:text-sm">
                Hair Stylists
              </Badge>
              <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer hover:bg-secondary transition-colors whitespace-nowrap text-xs sm:text-sm">
                Fashion Stylists
              </Badge>
              <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer hover:bg-secondary transition-colors whitespace-nowrap text-xs sm:text-sm">
                Makeup Artists
              </Badge>
              <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer hover:bg-secondary transition-colors whitespace-nowrap text-xs sm:text-sm">
                Verified Only
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stylists Grid */}
      <div className="max-w-md mx-auto px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8 sm:py-12 pb-24">
        {error ? (
          <Card className="p-4">
            <div className="text-lg font-bold">Couldn't load stylists</div>
            <div className="mt-2 text-sm text-muted-foreground">{error.message}</div>
          </Card>
        ) : items.length === 0 ? (
          <Card className="p-4">
            <div className="text-lg font-bold">No stylists yet</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Your profiles table returned no rows with an id.
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p: any) => {
              const id = String(p.id);
              const name = p.display_name || "Unnamed stylist";
              const subtitle = p.headline || "Beauty · Fashion";
              const review_count = p.review_count ?? 0;
              const avg_rating = p.avg_rating ?? 0;
              const avatarUrl = p.avatar_url && p.avatar_url.trim() !== '' ? p.avatar_url : null;

              return (
                <Link key={p.id ?? id} href={`/stylist/${id}`} className="w-full">
                  <Card
                    className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-border/50 w-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={avatarUrl || undefined}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* TODO: Add verified badge when verified status is available in profile */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                              {name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {subtitle}
                            </p>
                          </div>
                          {/* TODO: Add price when available in profile */}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          {review_count > 0 ? (
                            <>
                              <div className="flex items-center gap-1">
                                <Star className="size-3 sm:size-4 fill-amber-400 text-amber-400" />
                                <span className="text-xs sm:text-sm">{avg_rating.toFixed(1)}</span>
                              </div>
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                ({review_count} {review_count === 1 ? "review" : "reviews"})
                              </span>
                            </>
                          ) : (
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              No reviews yet
                            </span>
                          )}
                        </div>

                        {/* TODO: Add location when available in profile */}
                        {/* TODO: Add tags when available in profile */}
                      </div>

                      <Button className="w-full" size="default">
                        View Profile
                      </Button>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
