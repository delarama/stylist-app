"use client";

import { Heart, MessageCircle, Bookmark, MoreHorizontal, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { formatRelativeTime } from "@/lib/date-utils";

interface ApiPost {
  id: string;
  image_url: string | null;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  created_at: string;
  author_id: string;
  author: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface Post {
  id: string;
  stylist: {
    id: string;
    name: string;
    image: string | null;
    specialty: string;
    verified: boolean;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

interface SocialFeedProps {
  onStylistClick: (id: number) => void;
}

export function SocialFeed({ onStylistClick }: SocialFeedProps) {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts");
      const data = await response.json();

      if (!response.ok || !data.ok) {
        const errMsg = data.error || "Failed to load posts";
        setError(
          errMsg.includes("<") || errMsg.length > 300
            ? "Unable to load posts. Please try again later."
            : errMsg
        );
        return;
      }

      // Transform API posts to component format
      const transformedPosts: Post[] = (data.posts || []).map((apiPost: ApiPost) => {
        const authorName = apiPost.author?.display_name || "Unknown";
        const authorAvatar = apiPost.author?.avatar_url || null;
        
        // Combine title and description for caption
        const caption = [apiPost.title, apiPost.description]
          .filter(Boolean)
          .join("\n\n") || "";

        return {
          id: apiPost.id,
          stylist: {
            id: apiPost.author_id,
            name: authorName,
            image: authorAvatar,
            specialty: "Stylist", // Default since we don't have specialty in posts
            verified: false, // Default since we don't have verified status
          },
          image: apiPost.image_url || "",
          caption: caption,
          likes: 0, // Default since we don't have like_count in the API response
          comments: 0, // Default since we don't have comment count
          timestamp: formatRelativeTime(apiPost.created_at),
          tags: apiPost.tags || [],
        };
      });

      setPosts(transformedPosts);
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setError("Unable to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Listen for refresh event
    const handleRefresh = () => {
      fetchPosts();
    };

    window.addEventListener("refreshFeed", handleRefresh as EventListener);
    return () => {
      window.removeEventListener("refreshFeed", handleRefresh as EventListener);
    };
  }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl tracking-tight">Discover</h1>
            <Badge variant="secondary" className="gap-1.5">
              <Sparkles className="size-3" />
              Social Marketplace
            </Badge>
          </div>
        </div>
      </div>

      {/* Masonry Feed */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 2, 768: 3, 1024: 4 }}
          >
            <Masonry gutter="16px">
              {posts.map((post) => (
              <Link
                key={post.id}
                href={`/stylist/${post.stylist.id}`}
                className="block group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer w-full min-w-0"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                {/* Post Image */}
                <div className="w-full overflow-hidden bg-muted">
                  <div className="relative w-full aspect-[4/5]">
                    <ImageWithFallback
                      src={post.image || ""}
                      alt={post.caption || "Post image"}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  
                  {/* Overlay Gradient (visible on hover) */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                    hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
                  }`} />
                  
                  {/* Quick Actions (top right, visible on hover) */}
                  <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 ${
                    hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(post.id);
                      }}
                    >
                      <Bookmark
                        className={`size-4 transition-colors ${
                          savedPosts.includes(post.id)
                            ? 'fill-foreground text-foreground'
                            : 'text-foreground'
                        }`}
                      />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>

                  {/* Caption & Actions (bottom, visible on hover) */}
                  {post.caption && (
                    <div className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
                      hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <p className="text-white text-sm line-clamp-2 mb-3">
                        {post.caption}
                      </p>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(post.id);
                        }}
                      >
                        <Heart
                          className={`size-5 transition-colors ${
                            likedPosts.includes(post.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-white'
                          }`}
                        />
                        <span className="text-white text-sm ml-1.5">
                          {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="size-5 text-white" />
                        <span className="text-white text-sm ml-1.5">
                          {post.comments}
                        </span>
                      </Button>
                    </div>
                    </div>
                  )}
                  </div>
                </div>

                {/* Stylist Info (always visible) */}
                <div className="p-3 flex items-center gap-2 hover:bg-muted/50 transition-colors">
                  <Avatar className="w-8 h-8 ring-2 ring-primary/10">
                    <AvatarImage src={post.stylist.image || undefined} alt={post.stylist.name} />
                    <AvatarFallback>{post.stylist.name[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-medium truncate">{post.stylist.name}</h3>
                      {post.stylist.verified && (
                        <Sparkles className="size-3 text-primary fill-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{post.stylist.specialty}</p>
                  </div>
                </div>

                {/* Tags (always visible) */}
                {post.tags.length > 0 && (
                  <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="rounded-full">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
}