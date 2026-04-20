"use client";

import { useRouter } from "next/navigation";
import { StylistBrowse, type Stylist } from "../figma-redesign/src/app/components/stylist-browse";

interface BrowseClientProps {
  initialStylists: Stylist[];
  initialError: string | null;
}

export function StylistBrowseClient({ initialStylists, initialError }: BrowseClientProps) {
  const router = useRouter();

  const handleStylistClick = (id: string | number) => {
    router.push(`/stylist/${id}`);
  };

  return (
    <StylistBrowse
      stylists={initialStylists}
      onStylistClick={handleStylistClick}
      error={initialError}
    />
  );
}
