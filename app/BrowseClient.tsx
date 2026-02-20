"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { StylistBrowse, type Stylist } from "../figma-redesign/src/app/components/stylist-browse";

interface BrowseClientProps {
  initialStylists: Stylist[];
  initialError: string | null;
}

export function StylistBrowseClient({ initialStylists, initialError }: BrowseClientProps) {
  const router = useRouter();
  const [stylists, setStylists] = useState<Stylist[]>(initialStylists);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const fetchStylists = async (specialty: string | null) => {
    setLoading(true);
    setError(null);

    try {
      const url = specialty
        ? `/api/browse?specialty=${encodeURIComponent(specialty)}`
        : "/api/browse";
      
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to load stylists");
        setStylists([]);
        return;
      }

      // Map API response to Stylist interface
      const mappedStylists: Stylist[] = (data.stylists || []).map((p: any) => ({
        id: p.id,
        name: p.display_name || "Unnamed stylist",
        specialty: p.headline || "Beauty · Fashion",
        image: p.avatar_url || null,
        rating: p.avg_rating ?? null,
        reviews: p.review_count ?? null,
        location: undefined,
        price: undefined,
        verified: false,
        tags: undefined,
      }));

      setStylists(mappedStylists);
    } catch (err: any) {
      console.error("Error fetching stylists:", err);
      setError("Failed to load stylists. Please try again.");
      setStylists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch on initial load if we have a specialty filter
    if (selectedSpecialty !== null) {
      fetchStylists(selectedSpecialty);
    }
  }, [selectedSpecialty]);

  const handleStylistClick = (id: string | number) => {
    router.push(`/stylist/${id}`);
  };

  const handleFilterChange = (specialty: string | null) => {
    setSelectedSpecialty(specialty);
    fetchStylists(specialty);
  };

  return (
    <StylistBrowse
      stylists={stylists}
      onStylistClick={handleStylistClick}
      error={error}
      selectedSpecialty={selectedSpecialty}
      onFilterChange={handleFilterChange}
    />
  );
}
