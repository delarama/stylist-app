import { Heart, MessageCircle, Bookmark, MoreHorizontal, Sparkles, Plus } from "lucide-react";
import { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CreatePostDialog } from "./create-post-dialog";

interface Post {
  id: number;
  stylist: {
    id: number;
    name: string;
    image: string;
    specialty: string;
    verified: boolean;
  };
  image: string;
  title: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

const feedPosts: Post[] = [
  {
    id: 1,
    stylist: {
      id: 1,
      name: "Sophia Martinez",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      specialty: "Hair & Color Specialist",
      verified: true
    },
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
    title: "Balayage Magic ✨",
    caption: "Creating natural dimension with warm caramel tones. This technique takes time but the results are worth it! #balayage #haircolor #salonlife",
    likes: 342,
    comments: 28,
    timestamp: "2 hours ago",
    tags: ["Balayage", "Hair Color", "Blonde"]
  },
  {
    id: 2,
    stylist: {
      id: 2,
      name: "Isabella Chen",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
      specialty: "Fashion Stylist",
      verified: true
    },
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    title: "Spring Wardrobe Essentials",
    caption: "Mixing textures and neutrals for an effortless look. Link in bio for styling tips!",
    likes: 892,
    comments: 67,
    timestamp: "5 hours ago",
    tags: ["Fashion", "Style", "OOTD"]
  },
  {
    id: 3,
    stylist: {
      id: 3,
      name: "Emma Johnson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      specialty: "Makeup Artist",
      verified: true
    },
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    title: "Soft Bridal Glam 💕",
    caption: "Soft glam for today's bridal trial. Using @brandname foundation and @anotherbrand eyeshadow palette. DM for bookings!",
    likes: 1247,
    comments: 94,
    timestamp: "8 hours ago",
    tags: ["Bridal Makeup", "Glam", "MUA"]
  },
  {
    id: 4,
    stylist: {
      id: 4,
      name: "Olivia Williams",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
      specialty: "Personal Stylist",
      verified: true
    },
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    title: "Closet Organization Goals",
    caption: "Before & after transformation! Helped my client create a capsule wardrobe with pieces she actually loves. Swipe for the transformation!",
    likes: 567,
    comments: 43,
    timestamp: "12 hours ago",
    tags: ["Wardrobe", "Organization", "Style"]
  },
  {
    id: 5,
    stylist: {
      id: 5,
      name: "Ava Rodriguez",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
      specialty: "Hair Stylist",
      verified: false
    },
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    title: "Curly Hair Essentials 🌀",
    caption: "These are my go-to products for maintaining healthy, defined curls. What's your favorite curl product?",
    likes: 423,
    comments: 56,
    timestamp: "1 day ago",
    tags: ["Curly Hair", "Hair Care", "Natural Hair"]
  },
  {
    id: 6,
    stylist: {
      id: 6,
      name: "Mia Thompson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
      specialty: "Bridal Stylist",
      verified: true
    },
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    title: "Romantic Bridal Updo",
    caption: "Yesterday's beautiful bride ✨💍 Romantic updo with soft waves and baby's breath. Congratulations to the happy couple!",
    likes: 1891,
    comments: 142,
    timestamp: "1 day ago",
    tags: ["Bridal Hair", "Wedding", "Updo"]
  }
];

interface SocialFeedProps {
  onStylistClick: (id: number) => void;
  currentUserIsStylist?: boolean;
  currentUserName?: string;
  currentUserSpecialty?: string;
}

export function SocialFeed({ 
  onStylistClick, 
  currentUserIsStylist = false,
  currentUserName = "Your Name",
  currentUserSpecialty = "Your Specialty"
}: SocialFeedProps) {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const toggleLike = (postId: number) => {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSave = (postId: number) => {
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
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 2, 768: 3, 1024: 4 }}
        >
          <Masonry gutter="16px">
            {feedPosts.map((post) => (
              <div
                key={post.id}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                {/* Post Image */}
                <div className="relative">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-auto object-cover"
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
                  <div className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
                    hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <h4 className="text-white font-semibold text-base mb-2 line-clamp-1">
                      {post.title}
                    </h4>
                    <p className="text-white/90 text-sm line-clamp-2 mb-3">
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
                </div>

                {/* Stylist Info (always visible) */}
                <div 
                  className="p-3 flex items-center gap-2 hover:bg-muted/50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStylistClick(post.stylist.id);
                  }}
                >
                  <Avatar className="w-8 h-8 ring-2 ring-primary/10">
                    <AvatarImage src={post.stylist.image} alt={post.stylist.name} />
                    <AvatarFallback>{post.stylist.name[0]}</AvatarFallback>
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
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="rounded-full">
            Load More Posts
          </Button>
        </div>
      </div>

      {/* Create Post Button */}
      {currentUserIsStylist && (
        <button
          onClick={() => setCreatePostOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary text-primary-foreground shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-200 flex items-center justify-center group"
          aria-label="Create post"
        >
          <Plus className="size-6 sm:size-7 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      )}

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        stylistName={currentUserName}
        stylistSpecialty={currentUserSpecialty}
      />
    </div>
  );
}