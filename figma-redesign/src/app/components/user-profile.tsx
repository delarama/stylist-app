import { ArrowLeft, Camera, Mail, Phone, MapPin, Calendar, Edit, Save, Bell, Lock, CreditCard, Heart, Star } from "lucide-react";
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
    birthday: "1995-06-15"
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="size-4" />
              </Button>
              <h1 className="text-2xl">Profile</h1>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="size-4" />
                Edit
              </Button>
            ) : (
              <Button onClick={handleSave} className="gap-2">
                <Save className="size-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
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
                <Badge variant="outline">12 Bookings</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-8">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card className="p-6">
              <h3 className="mb-6">Personal Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="p-6">
              <h3 className="mb-6">Notifications & Preferences</h3>
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
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3>Favorite Stylists</h3>
                  <Badge variant="secondary">{favoritedStylists.length} Favorites</Badge>
                </div>
                <div className="space-y-4">
                  {favoritedStylists.map((stylist) => (
                    <div key={stylist.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={stylist.image} alt={stylist.name} />
                          <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="mb-1">{stylist.name}</h4>
                          <p className="text-sm text-muted-foreground">{stylist.specialty}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm">{stylist.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Heart className="size-4 fill-current" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Saved Searches</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="mb-1">Hair Colorists in New York</h4>
                      <p className="text-sm text-muted-foreground">24 stylists match</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="mb-1">Bridal Makeup Artists</h4>
                      <p className="text-sm text-muted-foreground">18 stylists match</p>
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
              <Card className="p-6">
                <h3 className="mb-6">Password & Security</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                    <Lock className="size-5" />
                    <div className="text-left">
                      <div className="mb-1">Change Password</div>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                    <Bell className="size-5" />
                    <div className="text-left">
                      <div className="mb-1">Two-Factor Authentication</div>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-6">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                        <CreditCard className="size-5 text-white" />
                      </div>
                      <div>
                        <h4 className="mb-1">•••• •••• •••• 4242</h4>
                        <p className="text-sm text-muted-foreground">Expires 12/26</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full">Add Payment Method</Button>
                </div>
              </Card>

              <Card className="p-6 border-destructive/50">
                <h3 className="mb-4 text-destructive">Danger Zone</h3>
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