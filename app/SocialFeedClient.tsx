"use client";

import { useRouter } from "next/navigation";
import { SocialFeed } from "@/app/components/social-feed";

export function SocialFeedClient() {
  const router = useRouter();

  const handleStylistClick = (id: number) => {
    router.push(`/stylist/${id}`);
  };

  return <SocialFeed onStylistClick={handleStylistClick} />;
}
