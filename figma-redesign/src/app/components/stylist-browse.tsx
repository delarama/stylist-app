import { Search, SlidersHorizontal, Star, MapPin, Award } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Stylist {
  id: number | string;
  name: string;
  specialty: string;
  image: string | null;
  rating: number | null;
  reviews: number | null;
  location?: string;
  price?: string;
  verified: boolean;
  tags?: string[];
}

const defaultStylists: Stylist[] = [
  {
    id: 1,
    name: "Sophia Martinez",
    specialty: "Hair & Color Specialist",
    image: "https://images.unsplash.com/photo-1737063935340-f9af0940c4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYWlyc3R5bGlzdCUyMHdvbWFufGVufDF8fHx8MTc3MDI3NzYxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 127,
    location: "New York, NY",
    price: "$$$",
    verified: true,
    tags: ["Balayage", "Extensions", "Bridal"]
  },
  {
    id: 2,
    name: "Isabella Chen",
    specialty: "Fashion & Wardrobe Stylist",
    image: "https://images.unsplash.com/photo-1758613654271-0885b35ae255?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGlzdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzAzNTMyNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5.0,
    reviews: 89,
    location: "Los Angeles, CA",
    price: "$$$$",
    verified: true,
    tags: ["Editorial", "Celebrity", "Personal Shopping"]
  },
  {
    id: 3,
    name: "Emma Johnson",
    specialty: "Makeup Artist",
    image: "https://images.unsplash.com/photo-1600637070413-0798fafbb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBhcnRpc3QlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwMzEzNTUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 203,
    location: "Miami, FL",
    price: "$$",
    verified: true,
    tags: ["Bridal", "Editorial", "Airbrushing"]
  },
  {
    id: 4,
    name: "Olivia Williams",
    specialty: "Personal Stylist",
    image: "https://images.unsplash.com/photo-1686628101951-ce2bd65ab579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHN0eWxpc3QlMjBmYXNoaW9uYWJsZXxlbnwxfHx8fDE3NzAzNTMyNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 156,
    location: "Chicago, IL",
    price: "$$$",
    verified: true,
    tags: ["Wardrobe Consulting", "Color Analysis", "Closet Edit"]
  },
  {
    id: 5,
    name: "Ava Rodriguez",
    specialty: "Hair Stylist & Colorist",
    image: "https://images.unsplash.com/photo-1760038548850-bfc356d88b12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc2Fsb24lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwMzUzMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 94,
    location: "Austin, TX",
    price: "$$",
    verified: false,
    tags: ["Curly Hair", "Highlights", "Cutting"]
  },
  {
    id: 6,
    name: "Mia Thompson",
    specialty: "Bridal & Event Stylist",
    image: "https://images.unsplash.com/photo-1626383137804-ff908d2753a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGludGVyaW9yfGVufDF8fHx8MTc3MDMxMTM2MXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5.0,
    reviews: 178,
    location: "Seattle, WA",
    price: "$$$$",
    verified: true,
    tags: ["Bridal", "Updo", "Special Events"]
  }
];

interface StylistBrowseProps {
  onStylistClick: (id: number | string) => void;
  stylists?: Stylist[];
  error?: string | null;
  selectedSpecialty?: string | null;
  onFilterChange?: (specialty: string | null) => void;
}

export function StylistBrowse({ onStylistClick, stylists: externalStylists, error }: StylistBrowseProps) {
  const stylists = externalStylists ?? defaultStylists;
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-destructive">{error}</div>
      )}
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
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:py-12">
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
                  src={stylist.image ?? ""}
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
                    <div className="flex items-center gap-1">
                      <Star className="size-3 sm:size-4 fill-amber-400 text-amber-400" />
                      <span className="text-xs sm:text-sm">{stylist.rating ?? "—"}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({stylist.reviews ?? 0} reviews)
                    </span>
                  </div>

                  {/* Location */}
                  {stylist.location && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      <MapPin className="size-3 sm:size-4" />
                      {stylist.location}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {(stylist.tags ?? []).slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="default">
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}