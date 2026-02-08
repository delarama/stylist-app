"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Bell,
  Lock,
  CreditCard,
  Heart,
  Star,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Switch } from "@/app/components/ui/switch";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";

interface ProfileData {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  email?: string;
  phone?: string;
  location?: string;
  categories?: string[];
  created_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    categories: [] as string[],
    phone: "",
    location: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/");
          return;
        }

        setUserEmail(user.email || "");

        // Fetch profile from profiles table
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("id, display_name, bio, avatar_url, created_at")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (profileData) {
          setProfile(profileData);
          setFormData({
            display_name: profileData.display_name || "",
            bio: profileData.bio || "",
            categories: [], // TODO: Add categories field to profiles table if needed
            phone: "", // TODO: Add phone field to profiles table if needed
            location: "", // TODO: Add location field to profiles table if needed
          });
        } else {
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              display_name: user.email?.split("@")[0] || "User",
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
            return;
          }

          if (newProfile) {
            setProfile(newProfile);
            setFormData({
              display_name: newProfile.display_name || "",
              bio: newProfile.bio || "",
              categories: [],
              phone: "",
              location: "",
            });
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        setAvatarPreview(null);
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Error updating avatar:", updateError);
        setAvatarPreview(null);
        return;
      }

      setProfile({ ...profile, avatar_url: publicUrl });
    } catch (error) {
      console.error("Error handling avatar change:", error);
      setAvatarPreview(null);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: formData.display_name || null,
          bio: formData.bio || null,
          // TODO: Add categories, phone, location fields if they exist in the table
        })
        .eq("id", profile.id);

      if (error) {
        console.error("Error saving profile:", error);
        return;
      }

      setProfile({
        ...profile,
        display_name: formData.display_name,
        bio: formData.bio,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        categories: [],
        phone: "",
        location: "",
      });
    }
    setAvatarPreview(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md bg-background min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-md bg-background min-h-screen px-5 py-6">
        <h1 className="text-2xl font-extrabold mb-2">Profile not found</h1>
        <p className="text-sm text-muted-foreground">
          Unable to load your profile. Please try again.
        </p>
      </div>
    );
  }

  const displayName = formData.display_name || profile.display_name || "User";
  const avatarUrl = avatarPreview || profile.avatar_url;
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="-ml-2"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <h1 className="text-2xl">Profile</h1>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="size-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="gap-2" disabled={saving}>
                  <Save className="size-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <Card className="p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback>
                  {displayName[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="size-4" />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <Input
                  value={formData.display_name}
                  onChange={(e) =>
                    setFormData({ ...formData, display_name: e.target.value })
                  }
                  className="text-2xl font-bold mb-2 text-center sm:text-left"
                  placeholder="Your name"
                />
              ) : (
                <h2 className="text-2xl mb-2">{displayName}</h2>
              )}
              <p className="text-muted-foreground mb-4">
                Member since {memberSince}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="gap-1.5">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  Verified Member
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 mb-8">
            <TabsTrigger value="personal" className="text-xs sm:text-sm">
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs sm:text-sm">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              Security
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card className="p-6">
              <h3 className="mb-6 text-lg font-semibold">Personal Information</h3>
              <div className="space-y-6 w-full min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
                  <div className="space-y-2 w-full min-w-0">
                    <Label htmlFor="display_name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="display_name"
                        value={formData.display_name}
                        onChange={(e) =>
                          setFormData({ ...formData, display_name: e.target.value })
                        }
                        className="w-full min-w-0"
                      />
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 border border-border rounded-md bg-muted/50 w-full min-w-0">
                        <span className="min-w-0 truncate">
                          {formData.display_name || "Not set"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 w-full min-w-0">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 h-10 px-3 border border-border rounded-md bg-muted/50 w-full min-w-0">
                      <Mail className="size-4 text-muted-foreground shrink-0" />
                      <span className="min-w-0 truncate">
                        {userEmail || "Not set"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="flex items-start gap-2 min-h-[100px] px-3 py-2 border border-border rounded-md bg-muted/50">
                        {formData.bio || "No bio yet. Tap Edit to add one."}
                      </div>
                    )}
                  </div>

                  {/* TODO: Add phone, location, birthday fields when they exist in the profiles table */}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="p-6">
              <h3 className="mb-6 text-lg font-semibold">
                Notifications & Preferences
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Promotions & Offers</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive special offers from stylists
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly beauty tips and trends
                    </p>
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
                  <h3 className="text-lg font-semibold">Favorite Stylists</h3>
                  <Badge variant="secondary">0 Favorites</Badge>
                </div>
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No favorite stylists yet
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Saved Searches</h3>
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No saved searches yet
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold">Password & Security</h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-4"
                  >
                    <Lock className="size-5" />
                    <div className="text-left">
                      <div className="mb-1">Change Password</div>
                      <p className="text-sm text-muted-foreground">
                        Update your account password
                      </p>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-4"
                  >
                    <Bell className="size-5" />
                    <div className="text-left">
                      <div className="mb-1">Two-Factor Authentication</div>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                  </Button>
                </div>
              </Card>

              <Card className="p-6 border-destructive/50">
                <h3 className="mb-4 text-destructive text-lg font-semibold">
                  Danger Zone
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                  >
                    Deactivate Account
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                  >
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
