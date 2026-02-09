"use client";

import { useRouter } from "next/navigation";
import { StylistProfile } from "../../../figma-redesign/src/app/components/stylist-profile";

interface StylistProfileClientProps {
  stylistId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
}

export function StylistProfileClient({ 
  stylistId, 
  displayName,
  bio,
  avatarUrl
}: StylistProfileClientProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleChat = () => {
    router.push(`/chats`);
  };

  return (
    <StylistProfile
      stylistId={stylistId as any}
      onBack={handleBack}
      onChat={handleChat}
      displayName={displayName}
      bio={bio}
      avatarUrl={avatarUrl}
    />
  );
}
