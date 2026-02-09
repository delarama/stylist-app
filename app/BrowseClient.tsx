"use client";

import { useRouter } from "next/navigation";
import { StylistBrowse, type Stylist } from "../figma-redesign/src/app/components/stylist-browse";

interface BrowseClientProps {
  stylists: Stylist[];
  error: string | null;
}

export function StylistBrowseClient({ stylists, error }: BrowseClientProps) {
  const router = useRouter();

  const handleStylistClick = (id: string | number) => {
    router.push(`/stylist/${id}`);
  };

  return (
    <StylistBrowse
      stylists={stylists}
      onStylistClick={handleStylistClick}
      error={error}
    />
  );
}
