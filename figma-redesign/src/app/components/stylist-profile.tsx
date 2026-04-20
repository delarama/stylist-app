import { ArrowLeft, Star, MapPin, Award, MessageCircle, Heart, Share2, Clock, DollarSign, Grid3X3, Bookmark } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface Post {
  id: number;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

const reviews: Review[] = [
  {
    id: 1,
    author: "Sarah Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5,
    date: "2 weeks ago",
    comment: "Absolutely amazing experience! Sophia transformed my hair and gave me the confidence boost I needed. Her attention to detail and expertise in color is unmatched. Highly recommend!"
  },
  {
    id: 2,
    author: "Emily Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 5,
    date: "1 month ago",
    comment: "Best stylist I've ever worked with! Professional, creative, and so talented. The balayage came out perfect and I get compliments everywhere I go."
  },
  {
    id: 3,
    author: "Jessica Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    rating: 4,
    date: "2 months ago",
    comment: "Great service and beautiful results. Very happy with my haircut and color. Will definitely be returning!"
  }
];

const stylistPosts: Post[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
    caption: "Balayage magic ✨ Creating natural dimension with warm caramel tones.",
    likes: 342,
    comments: 28,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    caption: "Sunset hair transformation 🌅 From brunette to copper goddess!",
    likes: 521,
    comments: 43,
    timestamp: "1 day ago"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
    caption: "Textured bob perfection 💇‍♀️ #haircut #bob #hairstyle",
    likes: 298,
    comments: 19,
    timestamp: "3 days ago"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800",
    caption: "Bridal hair goals 👰✨ Soft romantic waves for yesterday's beautiful bride",
    likes: 687,
    comments: 52,
    timestamp: "5 days ago"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1595475884562-073c8b8072f2?w=800",
    caption: "Color correction transformation! Patience and skill pay off 🎨",
    likes: 892,
    comments: 76,
    timestamp: "1 week ago"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800",
    caption: "Extensions installed! Added length and volume for this beauty 💫",
    likes: 445,
    comments: 34,
    timestamp: "1 week ago"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
    caption: "Before and after highlights ☀️ Love how this turned out!",
    likes: 612,
    comments: 41,
    timestamp: "2 weeks ago"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800",
    caption: "Styling tips: How to maintain your color at home 💡",
    likes: 378,
    comments: 29,
    timestamp: "2 weeks ago"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=800",
    caption: "Curly hair care routine essentials 🌀 Swipe for product recs",
    likes: 534,
    comments: 48,
    timestamp: "3 weeks ago"
  }
];

interface StylistProfileProps {
  stylistId: number | string;
  onBack: () => void;
  onChat: () => void;
  displayName?: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export function StylistProfile({ stylistId, onBack, onChat }: StylistProfileProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const ratingBreakdown = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      {/* Header */}
      <div className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 lg:px-8 sm:py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="gap-2 -ml-2 sm:ml-0">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="size-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:py-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="relative">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-4 ring-primary/10">
              <AvatarImage 
                src="https://images.unsplash.com/photo-1737063935340-f9af0940c4c5?w=200" 
                alt="Sophia Martinez" 
              />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-2 shadow-lg border-2 border-background">
              <Award className="size-4 sm:size-5 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl mb-2">Sophia Martinez</h1>
            <p className="text-base text-muted-foreground mb-4">Hair & Color Specialist</p>
            
            {/* Stats */}
            <div className="flex items-center justify-center sm:justify-start gap-6 mb-4">
              <div className="text-center">
                <div className="font-semibold text-lg">{stylistPosts.length}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">2.4k</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">127</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <span className="text-lg font-semibold">4.9</span>
              </div>
              <Badge variant="secondary" className="gap-1.5">
                <Award className="size-3" />
                Verified Pro
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                New York, NY
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                Responds in 2h
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="size-4" />
                $85/hour
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm mb-6 max-w-2xl">
              ✨ Hair & Color Specialist | NYC
              <br />
              💇‍♀️ Balayage • Extensions • Bridal
              <br />
              💬 Chat to book a session
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={onChat} size="lg" className="flex-1 sm:flex-initial gap-2">
                <MessageCircle className="size-4" />
                Start Chat
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-initial">
                Follow
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="posts" className="gap-2">
              <Grid3X3 className="size-4" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              About
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {stylistPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="aspect-square bg-muted overflow-hidden group relative"
                >
                  <ImageWithFallback
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-4 text-white text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="size-5 fill-white" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="size-5 fill-white" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card className="p-6">
              <h3 className="text-xl mb-4">About</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Balayage</Badge>
                    <Badge variant="secondary">Hair Extensions</Badge>
                    <Badge variant="secondary">Bridal Hair</Badge>
                    <Badge variant="secondary">Color Correction</Badge>
                    <Badge variant="secondary">Highlights</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Experience</h4>
                  <p className="text-muted-foreground">
                    With over 8 years of experience in the beauty industry, I specialize in creating natural-looking color transformations and textured cuts. I'm passionate about helping clients feel confident and beautiful.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Certifications</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Advanced Balayage Specialist</li>
                    <li>• Hair Extension Certified</li>
                    <li>• Olaplex Certified Professional</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              {/* Rating Overview */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="text-center sm:text-left">
                    <div className="text-5xl font-bold mb-2">4.9</div>
                    <div className="flex items-center gap-1 justify-center sm:justify-start mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="size-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {ratingBreakdown.map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm">{rating.stars}</span>
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                        </div>
                        <Progress value={rating.percentage} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-12">{rating.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.avatar} alt={review.author} />
                        <AvatarFallback>{review.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{review.author}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`size-3 ${
                                      star <= review.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div className="max-w-4xl w-full bg-background rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square bg-muted">
                <ImageWithFallback
                  src={selectedPost.image}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Sophia Martinez</h4>
                    <p className="text-xs text-muted-foreground">Hair & Color Specialist</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <p className="text-sm mb-4">{selectedPost.caption}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{selectedPost.likes} likes</span>
                    <span>{selectedPost.comments} comments</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 uppercase">{selectedPost.timestamp}</p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Heart className="size-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <MessageCircle className="size-4 mr-2" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
