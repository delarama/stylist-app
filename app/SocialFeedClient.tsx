"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SocialFeed } from "@/app/components/social-feed";
import { supabase } from "@/lib/supabase";
import { CreatePostModal } from "@/app/components/CreatePostModal";

export function SocialFeedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    async function checkAndOpenModal() {
      const openCreatePost = searchParams.get("openCreatePost");
      
      if (openCreatePost === "1") {
        // Check if user is signed in
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // User is signed in - open modal
          setIsCreateModalOpen(true);
          // Clean URL by removing query params
          router.replace("/");
        }
      }
      
      setCheckedAuth(true);
    }

    checkAndOpenModal();
  }, [searchParams, router]);

  const handleStylistClick = (id: number) => {
    router.push(`/stylist/${id}`);
  };

  const handlePostSuccess = () => {
    // Trigger a custom event that the feed can listen to
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("refreshFeed"));
    }
  };

  return (
    <>
      <SocialFeed onStylistClick={handleStylistClick} />
      {checkedAuth && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handlePostSuccess}
        />
      )}
    </>
  );
}
