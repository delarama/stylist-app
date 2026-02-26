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
  Sparkles,
  Check,
  User,
  LogOut,
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
import { PageShell } from "@/app/components/PageShell";
import { Textarea } from "@/app/components/ui/textarea";
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
  is_stylist?: boolean;
  specialties?: string[];
}

// Helper function to extract useful error information from Supabase errors
function logSupabaseError(context: string, error: any) {
  const errorInfo = {
    message: error?.message || "Unknown error",
    details: error?.details || null,
    hint: error?.hint || null,
    code: error?.code || null,
  };
  
  console.error(`Error ${context}:`, {
    message: errorInfo.message,
    details: errorInfo.details,
    hint: errorInfo.hint,
    code: errorInfo.code,
    fullError: error,
  });
  
  return errorInfo;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    categories: [] as string[],
    phone: "",
    location: "",
  });
  const [isStylist, setIsStylist] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [originalIsStylist, setOriginalIsStylist] = useState(false);
  const [originalSpecialties, setOriginalSpecialties] = useState<string[]>([]);
  const [stylistError, setStylistError] = useState<string | null>(null);
  const [stylistSuccess, setStylistSuccess] = useState(false);
  const [savingStylist, setSavingStylist] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Specialty options matching Browse filter options
  const specialtyOptions = [
    { id: "hair", label: "Hair Stylists" },
    { id: "makeup", label: "Makeup Artists" },
    { id: "fashion", label: "Fashion Stylists" },
    { id: "skincare", label: "Skincare" },
  ];

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

        if (!user) {
          setLoading(false);
          router.replace("/signin");
          return;
        }

        setUserEmail(user.email || "");

        // Fetch profile from profiles table
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("id, display_name, bio, avatar_url, created_at, is_stylist, specialties")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          const errorInfo = logSupabaseError("fetching profile", error);
          setError(errorInfo.message || "Failed to load profile. Please try again.");
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
          setIsStylist(profileData.is_stylist || false);
          setSelectedSpecialties(profileData.specialties || []);
          setOriginalIsStylist(profileData.is_stylist || false);
          setOriginalSpecialties(profileData.specialties || []);
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
            const errorInfo = logSupabaseError("creating profile", createError);
            setError(errorInfo.message || "Failed to create profile. Please try again.");
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
            setIsStylist(newProfile.is_stylist || false);
            setSelectedSpecialties(newProfile.specialties || []);
            setOriginalIsStylist(newProfile.is_stylist || false);
            setOriginalSpecialties(newProfile.specialties || []);
          }
        }
      } catch (error: any) {
        // Handle unexpected errors (not Supabase errors)
        const errorMessage = error?.message || String(error) || "An unexpected error occurred";
        console.error("Error loading profile:", {
          message: errorMessage,
          stack: error?.stack,
          fullError: error,
        });
        setError(errorMessage || "Failed to load profile. Please try again.");
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
        } catch (error: any) {
          const errorMessage = error?.message || String(error) || "An unexpected error occurred";
          console.error("Error handling avatar change:", {
            message: errorMessage,
            stack: error?.stack,
            fullError: error,
          });
          setError(errorMessage || "Failed to upload avatar. Please try again.");
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
          is_stylist: isStylist,
          specialties: selectedSpecialties.length > 0 ? selectedSpecialties : null,
          // TODO: Add categories, phone, location fields if they exist in the table
        })
        .eq("id", profile.id);

      if (error) {
        const errorInfo = logSupabaseError("saving profile", error);
        setError(errorInfo.message || "Failed to save profile. Please try again.");
        return;
      }

      // Clear any previous errors on successful save
      setError(null);

      setProfile({
        ...profile,
        display_name: formData.display_name,
        bio: formData.bio,
        is_stylist: isStylist,
        specialties: selectedSpecialties,
      });
      setIsEditing(false);
    } catch (error: any) {
      // Handle unexpected errors (not Supabase errors)
      const errorMessage = error?.message || String(error) || "An unexpected error occurred";
      console.error("Error saving profile:", {
        message: errorMessage,
        stack: error?.stack,
        fullError: error,
      });
      setError(errorMessage || "Failed to save profile. Please try again.");
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
      setIsStylist(profile.is_stylist || false);
      setSelectedSpecialties(profile.specialties || []);
    }
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const toggleSpecialty = (specialtyId: string) => {
    const newSpecialties = selectedSpecialties.includes(specialtyId)
      ? selectedSpecialties.filter((id) => id !== specialtyId)
      : [...selectedSpecialties, specialtyId];
    
    setSelectedSpecialties(newSpecialties);
    setStylistSuccess(false);
  };

  const handleStylistToggle = (checked: boolean) => {
    setIsStylist(checked);
    
    // If turning OFF, clear specialties in UI immediately
    if (!checked) {
      setSelectedSpecialties([]);
    }
    
    setStylistSuccess(false);
  };

  const hasStylistChanges = () => {
    const isStylistChanged = isStylist !== originalIsStylist;
    const specialtiesChanged = 
      JSON.stringify([...selectedSpecialties].sort()) !== 
      JSON.stringify([...originalSpecialties].sort());
    return isStylistChanged || specialtiesChanged;
  };

  const handleSaveStylist = async () => {
    if (!profile) return;

    setSavingStylist(true);
    setStylistError(null);
    setStylistSuccess(false);

    try {
      const specialtiesToSave = isStylist && selectedSpecialties.length > 0 
        ? selectedSpecialties 
        : null;

      const { error } = await supabase
        .from("profiles")
        .update({
          is_stylist: isStylist,
          specialties: specialtiesToSave,
        })
        .eq("id", profile.id);

      if (error) {
        const errorInfo = logSupabaseError("saving stylist fields", error);
        setStylistError("Couldn't save. Try again.");
        return;
      }

      // Update local state and original values
      setProfile({
        ...profile,
        is_stylist: isStylist,
        specialties: selectedSpecialties,
      });
      setOriginalIsStylist(isStylist);
      setOriginalSpecialties(selectedSpecialties);
      setStylistSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStylistSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("Error saving stylist fields:", {
        message: error?.message,
        stack: error?.stack,
        fullError: error,
      });
      setStylistError("Couldn't save. Try again.");
    } finally {
      setSavingStylist(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <PageShell className="flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </PageShell>
    );
  }

  // Show sign-in prompt if user is not signed in
  if (!user && !loading) {
    return (
      <PageShell
        header={{
          left: (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="-ml-2"
            >
              <ArrowLeft className="size-4" />
            </Button>
          ),
          center: <h1 className="text-2xl">Profile</h1>,
          right: null,
        }}
        className="py-6"
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <User className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Sign in to view your profile</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            Please sign in to access your profile settings and manage your account.
          </p>
          <Button onClick={() => router.push("/signin")} size="lg">
            Sign In
          </Button>
        </div>
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell
        header={{
          left: (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="-ml-2"
            >
              <ArrowLeft className="size-4" />
            </Button>
          ),
          center: <h1 className="text-2xl">Profile</h1>,
          right: null,
        }}
        className="py-6"
      >
        <h1 className="text-2xl font-extrabold mb-2">Profile not found</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Unable to load your profile. Please try again.
        </p>
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </PageShell>
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
    <PageShell
      header={{
        left: (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="-ml-2"
          >
            <ArrowLeft className="size-4" />
          </Button>
        ),
        center: <h1 className="text-2xl">Profile</h1>,
        right: !isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign out
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit className="size-4" />
              Edit
            </Button>
          </div>
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
        ),
      }}
      className="bg-gradient-to-b from-background to-muted/20 py-8"
    >
      {/* Error Display */}
      {error && (
        <Card className="p-4 mb-6 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="mt-2 h-auto p-0 text-destructive hover:text-destructive/80"
          >
            Dismiss
          </Button>
        </Card>
      )}

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
                {isStylist && (
                  <Badge className="gap-1.5 bg-gradient-to-r from-primary to-primary/80">
                    <Sparkles className="size-3" />
                    Active Stylist
                  </Badge>
                )}
                {isStylist && selectedSpecialties.length > 0 && (
                  selectedSpecialties.map((specId) => {
                    const spec = specialtyOptions.find((s) => s.id === specId);
                    return spec ? (
                      <Badge key={specId} variant="outline">
                        {spec.label}
                      </Badge>
                    ) : null;
                  })
                )}
              </div>
            </div>
          </div>
        </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full mb-8 flex-wrap">
            <TabsTrigger value="personal" className="text-xs sm:text-sm">
              Personal
            </TabsTrigger>
            <TabsTrigger value="stylist" className="text-xs sm:text-sm relative">
              Stylist
              {isStylist && selectedSpecialties.length === 0 && (
                <span className="absolute -top-1 -right-1 size-2 bg-amber-500 rounded-full" />
              )}
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

              {/* Specialties Section - Only show when toggle is ON */}
              {isStylist && (
                <Card className="p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl mb-2">Select your specialties</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose all that apply to your services
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {specialtyOptions.map((specialty) => {
                      const isSelected = selectedSpecialties.includes(specialty.id);
                      return (
                        <button
                          key={specialty.id}
                          onClick={() => toggleSpecialty(specialty.id)}
                          className={`px-4 py-2 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`size-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-border'
                            }`}>
                              {isSelected && (
                                <Check className="size-2.5 text-primary-foreground" />
                              )}
                            </div>
                            <span className="text-sm sm:text-base">{specialty.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {stylistError && (
                    <p className="mt-4 text-sm text-destructive">{stylistError}</p>
                  )}
                  {stylistSuccess && (
                    <p className="mt-4 text-sm text-green-600">Saved</p>
                  )}
                </Card>
              )}

              {/* Save Button - Only show when there are unsaved changes */}
              {hasStylistChanges() && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveStylist}
                    disabled={savingStylist}
                    size="lg"
                  >
                    {savingStylist ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
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
    </PageShell>
  );
}
