import { supabaseServer } from "@/lib/supabaseServer";
import { StylistProfileClient } from "./StylistProfileClient";

export default async function StylistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await supabaseServer();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, display_name, bio, avatar_url, is_stylist")
    .eq("id", id)
    .maybeSingle();

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="px-4 pt-4">
          <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">Stylist not found</h1>
          <p className="text-sm text-neutral-400">
            {error ? `Error: ${error.message}` : "No stylist found with this ID."}
          </p>
        </div>
      </div>
    );
  }

  // Only show if is_stylist is true
  if (!profile.is_stylist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="px-4 pt-4">
          <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">Not a stylist</h1>
          <p className="text-sm text-neutral-400">
            This profile is not set up as a stylist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <StylistProfileClient
      stylistId={id}
      displayName={profile.display_name || "Unnamed Stylist"}
      bio={profile.bio}
      avatarUrl={profile.avatar_url}
    />
  );
}
