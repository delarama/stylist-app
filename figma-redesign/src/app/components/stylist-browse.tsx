import { Search, SlidersHorizontal, Star, MapPin, Award } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Stylist {
  id: string | number;
  name: string;
  specialty: string;
  image: string | null;
  rating: number | null;
  reviews: number | null;
  location?: string;
  price?: string;
  verified?: boolean;
  tags?: string[];
}

interface StylistBrowseProps {
  stylists: Stylist[];
  onStylistClick: (id: string | number) => void;
  error?: string | null;
}

export function StylistBrowse({ stylists, onStylistClick, error }: StylistBrowseProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 sm:py-6">
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
                className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base bg-background border-border/50"
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
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:py-12 pb-24">
        {error ? (
          <Card className="p-4">
            <div className="text-lg font-bold">Couldn't load stylists</div>
            <div className="mt-2 text-sm text-muted-foreground">{error}</div>
          </Card>
        ) : stylists.length === 0 ? (
          <Card className="p-4">
            <div className="text-lg font-bold">No stylists yet</div>
            <div className="mt-2 text-sm text-muted-foreground">
              No stylists found in the marketplace.
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {stylists.map((stylist) => (
              <Card 
                key={stylist.id} 
                className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-border/50"
                onClick={() => onStylistClick(stylist.id)}
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={stylist.image || undefined}
                    alt={stylist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {stylist.verified && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-background/95 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg">
                      <Award className="size-3 sm:size-4 text-primary" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                          {stylist.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {stylist.specialty}
                        </p>
                      </div>
                      {stylist.price && (
                        <div className="text-sm sm:text-base text-muted-foreground ml-2">
                          {stylist.price}
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      {stylist.reviews && stylist.reviews > 0 && stylist.rating ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Star className="size-3 sm:size-4 fill-amber-400 text-amber-400" />
                            <span className="text-xs sm:text-sm">{stylist.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            ({stylist.reviews} {stylist.reviews === 1 ? "review" : "reviews"})
                          </span>
                        </>
                      ) : (
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          No reviews yet
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    {stylist.location && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                        <MapPin className="size-3 sm:size-4" />
                        {stylist.location}
                      </div>
                    )}

                    {/* Tags */}
                    {stylist.tags && stylist.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {stylist.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button className="w-full" size="default">
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}