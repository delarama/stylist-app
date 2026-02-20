"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StylistProfile } from "../../../figma-redesign/src/app/components/stylist-profile";
import { formatRelativeTime } from "@/lib/date-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { Card } from "@/app/components/ui/card";

interface StylistProfileClientProps {
  stylistId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
}

interface Post {
  id: string;
  image_url: string | null;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  created_at: string;
  author_id: string;
  author: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function StylistProfileClient({ 
  stylistId, 
  displayName,
  bio,
  avatarUrl
}: StylistProfileClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoadingPosts(true);
        const response = await fetch(`/api/posts?author_id=${stylistId}`);
        const data = await response.json();

        if (response.ok && data.ok) {
          setPosts(data.posts || []);
        } else {
          console.error("Error fetching posts:", data.error);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchPosts();
  }, [stylistId]);

  const handleBack = () => {
    router.back();
  };

  const handleChat = () => {
    router.push(`/chats`);
  };

  return (
    <>
      <StylistProfile
        stylistId={stylistId as any}
        onBack={handleBack}
        onChat={handleChat}
        displayName={displayName}
        bio={bio}
        avatarUrl={avatarUrl}
      />

      {/* Posts Section */}
      <div className="w-full max-w-[420px] md:max-w-7xl md:px-6 lg:px-8 mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        
        {loadingPosts ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {/* Post Header */}
                <div className="p-4 flex items-center gap-3 border-b">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author?.avatar_url || undefined} alt={post.author?.display_name || "Author"} />
                    <AvatarFallback>
                      {post.author?.display_name?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {post.author?.display_name || "Unknown"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(post.created_at)}
                    </p>
                  </div>
                </div>

                {/* Post Image */}
                {post.image_url && (
                  <div className="aspect-square bg-muted">
                    <ImageWithFallback
                      src={post.image_url}
                      alt={post.title || "Post image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-4 space-y-2">
                  {post.title && (
                    <h4 className="text-base font-semibold">{post.title}</h4>
                  )}
                  {post.description && (
                    <p className="text-sm text-muted-foreground">{post.description}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
