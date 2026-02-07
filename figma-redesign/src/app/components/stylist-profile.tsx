import { ArrowLeft, Star, MapPin, Award, Calendar, MessageCircle, Heart, Share2, Instagram, Facebook, Clock, DollarSign } from "lucide-react";
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
  images?: string[];
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

const portfolioImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
  "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800",
  "https://images.unsplash.com/photo-1595475884562-073c8b8072f2?w=800",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800"
];

interface StylistProfileProps {
  stylistId: number;
  onBack: () => void;
  onChat: () => void;
}

export function StylistProfile({ stylistId, onBack, onChat }: StylistProfileProps) {
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
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 sm:py-4">
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

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="relative mx-auto sm:mx-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-muted">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1737063935340-f9af0940c4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYWlyc3R5bGlzdCUyMHdvbWFufGVufDF8fHx8MTc3MDI3NzYxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Sophia Martinez"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-2 shadow-lg border">
                  <Award className="size-4 sm:size-5 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl mb-2">Sophia Martinez</h1>
                    <p className="text-base sm:text-lg text-muted-foreground">Hair & Color Specialist</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 sm:size-5 fill-amber-400 text-amber-400" />
                    <span className="text-base sm:text-lg">4.9</span>
                    <span className="text-sm sm:text-base text-muted-foreground">(127 reviews)</span>
                  </div>
                  <Badge variant="secondary" className="gap-1.5 text-xs sm:text-sm">
                    <Award className="size-3" />
                    Verified Pro
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    New York, NY
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    Usually responds in 2h
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge variant="outline" className="text-xs sm:text-sm">Balayage</Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm">Extensions</Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm">Bridal</Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm">Color Correction</Badge>
                </div>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex gap-3 lg:hidden">
              <Button size="lg" className="flex-1" onClick={onChat}>
                <MessageCircle className="size-4 mr-2" />
                Message
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                <Calendar className="size-4 mr-2" />
                Book
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6 sm:mb-8">
                <TabsTrigger value="about" className="text-xs sm:text-sm">About</TabsTrigger>
                <TabsTrigger value="portfolio" className="text-xs sm:text-sm">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-4 sm:space-y-6">
                <Card className="p-4 sm:p-6">
                  <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">About Me</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    With over 10 years of experience in the beauty industry, I specialize in creating stunning hair transformations that enhance your natural beauty. My expertise includes precision cutting, advanced color techniques, and bridal styling. I'm passionate about staying current with the latest trends and techniques to give you the best possible experience.
                  </p>
                </Card>

                <Card className="p-4 sm:p-6">
                  <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">Experience & Credentials</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Award className="size-4 sm:size-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm sm:text-base">Master Stylist Certification</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Vidal Sassoon Academy - 2015</p>
                      </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Award className="size-4 sm:size-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm sm:text-base">Advanced Color Theory</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Redken Education - 2018</p>
                      </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Award className="size-4 sm:size-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm sm:text-base">Bridal Styling Specialist</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">International Beauty Academy - 2019</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6">
                  <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">Services & Pricing</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b">
                      <div>
                        <h4 className="text-sm sm:text-base">Women's Haircut</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Precision cut with styling</p>
                      </div>
                      <span className="text-base sm:text-lg">$85</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b">
                      <div>
                        <h4 className="text-sm sm:text-base">Balayage / Highlights</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Custom color placement</p>
                      </div>
                      <span className="text-base sm:text-lg">$250+</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b">
                      <div>
                        <h4 className="text-sm sm:text-base">Full Color</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">All-over color treatment</p>
                      </div>
                      <span className="text-base sm:text-lg">$150</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm sm:text-base">Bridal Package</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Trial + wedding day styling</p>
                      </div>
                      <span className="text-base sm:text-lg">$450</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {portfolioImages.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-muted cursor-pointer group">
                      <ImageWithFallback
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4 sm:space-y-6">
                {/* Rating Overview */}
                <Card className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                    <div className="text-center sm:text-left">
                      <div className="text-4xl sm:text-5xl mb-2">4.9</div>
                      <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="size-4 sm:size-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Based on 127 reviews</p>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      {ratingBreakdown.map((item) => (
                        <div key={item.stars} className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-1 w-10 sm:w-12">
                            <span className="text-xs sm:text-sm">{item.stars}</span>
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                          </div>
                          <Progress value={item.percentage} className="flex-1 h-2" />
                          <span className="text-xs sm:text-sm text-muted-foreground w-10 sm:w-12 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Reviews List */}
                <div className="space-y-3 sm:space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-4 sm:p-6">
                      <div className="flex gap-3 sm:gap-4">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                          <AvatarImage src={review.avatar} alt={review.author} />
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="mb-1 text-sm sm:text-base">{review.author}</h4>
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`size-3 sm:size-4 ${
                                        star <= review.rating 
                                          ? 'fill-amber-400 text-amber-400' 
                                          : 'text-muted-foreground/30'
                                      }`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs sm:text-sm text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-4">
            <Card className="p-6 sticky top-24">
              <div className="space-y-4">
                <Button size="lg" className="w-full" onClick={onChat}>
                  <MessageCircle className="size-4 mr-2" />
                  Message Sophia
                </Button>
                <Button size="lg" variant="outline" className="w-full">
                  <Calendar className="size-4 mr-2" />
                  Book Appointment
                </Button>
                
                <div className="pt-4 border-t space-y-3">
                  <h4 className="text-sm">Connect</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="flex-1">
                      <Instagram className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="flex-1">
                      <Facebook className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="text-sm">Availability</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span>9am - 7pm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span>10am - 6pm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="size-4" />
                    <span>Starting from $85 per service</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}