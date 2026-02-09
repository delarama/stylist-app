import { ArrowLeft, Camera, Mail, Phone, MapPin, Calendar, Edit, Save, Bell, Lock, CreditCard, Heart, Star, Sparkles, DollarSign, Upload, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface FavoriteStylist {
  id: number;
  name: string;
  specialty: string;
  image: string;
  rating: number;
}

const favoritedStylists: FavoriteStylist[] = [
  {
    id: 1,
    name: "Sophia Martinez",
    specialty: "Hair & Color Specialist",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    rating: 4.9
  },
  {
    id: 2,
    name: "Isabella Chen",
    specialty: "Fashion Stylist",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    rating: 5.0
  }
];

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Jessica Anderson",
    email: "jessica.anderson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    birthday: "1990-05-15"
  });

  // Stylist Settings
  const [isStylist, setIsStylist] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [stylistBio, setStylistBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  // Available specialties matching browse page filters
  const specialtyOptions = [
    { 
      id: 'hair',
      label: 'Hair Stylist', 
      description: 'Cuts, color, styling, treatments'
    },
    { 
      id: 'fashion',
      label: 'Fashion Stylist', 
      description: 'Personal styling, wardrobe consulting'
    },
    { 
      id: 'makeup',
      label: 'Makeup Artist', 
      description: 'Makeup application, lessons, bridal'
    },
    { 
      id: 'nails',
      label: 'Nail Technician', 
      description: 'Manicures, pedicures, nail art'
    },
    { 
      id: 'skin',
      label: 'Esthetician', 
      description: 'Skincare, facials, treatments'
    },
    { 
      id: 'barber',
      label: 'Barber', 
      description: 'Men\'s cuts, beard grooming'
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleStylistToggle = (checked: boolean) => {
    setIsStylist(checked);
    if (checked) {
      toast.success("Stylist mode activated! Complete your profile to appear in search.");
    } else {
      toast.success("Stylist mode deactivated");
      setSelectedSpecialty("");
      setStylistBio("");
      setHourlyRate("");
    }
  };

  const isProfileComplete = isStylist && selectedSpecialty && stylistBio && hourlyRate;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="size-4" />
              </Button>
              <h1 className="text-xl sm:text-2xl">Profile</h1>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="size-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            ) : (
              <Button onClick={handleSave} className="gap-2">
                <Save className="size-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Profile Header */}
        <Card className="p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" alt="Jessica Anderson" />
                <AvatarFallback>JA</AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="size-4" />
                </button>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl mb-2">{formData.fullName}</h2>
              <p className="text-muted-foreground mb-4">Member since January 2024</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="gap-1.5">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  Verified Member
                </Badge>
                {isStylist && (
                  <Badge className="gap-1.5 bg-gradient-to-r from-primary to-primary/80">
                    <Sparkles className="size-3" />
                    Active Stylist
                  </Badge>
                )}
                {isStylist && selectedSpecialty && (
                  <Badge variant="outline">
                    {specialtyOptions.find(s => s.id === selectedSpecialty)?.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-6 sm:mb-8 h-auto">
            <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal</TabsTrigger>
            <TabsTrigger value="stylist" className="text-xs sm:text-sm relative">
              Stylist
              {isStylist && !isProfileComplete && (
                <span className="absolute -top-1 -right-1 size-2 bg-amber-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs sm:text-sm">Preferences</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm">Favorites</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card className="p-4 sm:p-6">
              <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl">Personal Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 border border-border rounded-md bg-muted/50">
                        {formData.fullName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 border border-border rounded-md bg-muted/50">
                        <Mail className="size-4 text-muted-foreground" />
                        {formData.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 border border-border rounded-md bg-muted/50">
                        <Phone className="size-4 text-muted-foreground" />
                        {formData.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 border border-border rounded-md bg-muted/50">
                        <MapPin className="size-4 text-muted-foreground" />
                        {formData.location}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    {isEditing ? (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="birthday"
                          type="date"
                          value={formData.birthday}
                          onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 border border-border rounded-md bg-muted/50">
                        <Calendar className="size-4 text-muted-foreground" />
                        {new Date(formData.birthday).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Stylist Settings Tab */}
          <TabsContent value="stylist">
            <div className="space-y-4 sm:space-y-6">
              {/* Become a Stylist Toggle */}
              <Card className="p-4 sm:p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="size-5 text-primary" />
                      <h3 className="text-lg sm:text-xl">Offer Services as a Stylist</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enable this to appear in the marketplace and start connecting with clients
                    </p>
                  </div>
                  <Switch 
                    checked={isStylist} 
                    onCheckedChange={handleStylistToggle} 
                    className="shrink-0" 
                  />
                </div>
              </Card>

              {/* Stylist Profile Setup */}
              {isStylist ? (
                <>
                  {/* Profile Completion Alert */}
                  {!isProfileComplete && (
                    <Card className="p-4 border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                      <div className="flex gap-3">
                        <div className="size-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                          !
                        </div>
                        <div>
                          <h4 className="mb-1 text-amber-900 dark:text-amber-200">Complete Your Profile</h4>
                          <p className="text-sm text-amber-800 dark:text-amber-300">
                            Fill out all required fields below to appear in search results and start receiving inquiries.
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {isProfileComplete && (
                    <Card className="p-4 border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
                      <div className="flex gap-3">
                        <div className="size-5 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="size-3" />
                        </div>
                        <div>
                          <h4 className="mb-1 text-green-900 dark:text-green-200">Profile Active!</h4>
                          <p className="text-sm text-green-800 dark:text-green-300">
                            Your profile is complete and visible to clients searching for {specialtyOptions.find(s => s.id === selectedSpecialty)?.label}s.
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Specialty Selection */}
                  <Card className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl mb-2">Service Type</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose your primary specialty. This determines which filter category you appear under.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {specialtyOptions.map((specialty) => (
                        <button
                          key={specialty.id}
                          onClick={() => setSelectedSpecialty(specialty.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedSpecialty === specialty.id
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              selectedSpecialty === specialty.id
                                ? 'border-primary bg-primary'
                                : 'border-border'
                            }`}>
                              {selectedSpecialty === specialty.id && (
                                <Check className="size-3 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="mb-1 text-sm sm:text-base">{specialty.label}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {specialty.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Professional Bio */}
                  <Card className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl mb-2">Professional Bio</h3>
                      <p className="text-sm text-muted-foreground">
                        Tell clients about your experience, expertise, and what makes you unique
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="I specialize in modern cuts and color techniques with 5+ years of experience..."
                        value={stylistBio}
                        onChange={(e) => setStylistBio(e.target.value)}
                        className="min-h-[120px] resize-none"
                        maxLength={500}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>This will appear on your public profile</span>
                        <span>{stylistBio.length}/500</span>
                      </div>
                    </div>
                  </Card>

                  {/* Pricing */}
                  <Card className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl mb-2">Hourly Rate</h3>
                      <p className="text-sm text-muted-foreground">
                        Set your starting rate for consultations
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="relative max-w-xs">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="85"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          className="pl-10"
                          min="0"
                          step="5"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          /hour
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This is your base consultation rate. You can discuss specific pricing with clients.
                      </p>
                    </div>
                  </Card>

                  {/* Portfolio Upload */}
                  <Card className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl mb-2">Portfolio</h3>
                      <p className="text-sm text-muted-foreground">
                        Showcase your best work (optional but recommended)
                      </p>
                    </div>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="size-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm mb-1">Click to upload portfolio images</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</p>
                    </div>
                  </Card>
                </>
              ) : (
                /* Not a Stylist - Promotional Card */
                <Card className="p-8 sm:p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="size-16 sm:size-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="size-8 sm:size-10 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl mb-3">Share Your Talent</h3>
                    <p className="text-muted-foreground mb-6">
                      Join our marketplace and connect with clients looking for your expertise. Set your own rates, manage your schedule, and grow your business.
                    </p>
                    <ul className="text-sm text-left space-y-2 mb-6 inline-block">
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        <span>Appear in search results</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        <span>Set your own pricing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        <span>Build your client base</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        <span>Get paid securely</span>
                      </li>
                    </ul>
                    <Button 
                      onClick={() => handleStylistToggle(true)} 
                      size="lg" 
                      className="gap-2"
                    >
                      <Sparkles className="size-4" />
                      Become a Stylist
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="p-4 sm:p-6">
              <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl">Notifications & Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Messages</Label>
                    <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Promotions & Offers</Label>
                    <p className="text-sm text-muted-foreground">Receive special offers from stylists</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">Weekly beauty tips and trends</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="space-y-4">
              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl">Favorite Stylists</h3>
                  <Badge variant="secondary">{favoritedStylists.length} Favorites</Badge>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {favoritedStylists.map((stylist) => (
                    <div key={stylist.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg border">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 shrink-0">
                          <AvatarImage src={stylist.image} alt={stylist.name} />
                          <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h4 className="mb-1 text-sm sm:text-base truncate">{stylist.name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{stylist.specialty}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs sm:text-sm">{stylist.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="hidden sm:flex">View</Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Heart className="size-4 fill-current" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <h3 className="mb-4 text-lg sm:text-xl">Saved Searches</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="min-w-0 flex-1">
                      <h4 className="mb-1 text-sm sm:text-base truncate">Hair Colorists in New York</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">24 stylists match</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="min-w-0 flex-1">
                      <h4 className="mb-1 text-sm sm:text-base truncate">Bridal Makeup Artists</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">18 stylists match</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-4">
              <Card className="p-4 sm:p-6">
                <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl">Password & Security</h3>
                <div className="space-y-3 sm:space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3 sm:py-4">
                    <Lock className="size-4 sm:size-5 shrink-0" />
                    <div className="text-left">
                      <div className="mb-1 text-sm sm:text-base">Change Password</div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3 sm:py-4">
                    <Bell className="size-4 sm:size-5 shrink-0" />
                    <div className="text-left">
                      <div className="mb-1 text-sm sm:text-base">Two-Factor Authentication</div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </Button>
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl">Payment Methods</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center shrink-0">
                        <CreditCard className="size-4 sm:size-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="mb-1 text-sm sm:text-base">•••• •••• •••• 4242</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Expires 12/26</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">Default</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full">Add Payment Method</Button>
                </div>
              </Card>

              <Card className="p-4 sm:p-6 border-destructive/50">
                <h3 className="mb-4 text-destructive text-lg sm:text-xl">Danger Zone</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10">
                    Deactivate Account
                  </Button>
                  <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10">
                    Delete Account
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
