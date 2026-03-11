import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { ok: false, error: "NOT_SIGNED_IN" },
        { status: 401 }
      );
    }

    // Fetch profile from profiles table
    // Try to select specialties - if column doesn't exist, we'll handle it gracefully
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, bio, avatar_url, created_at, is_stylist, specialties")
      .eq("id", user.id)
      .maybeSingle();

    // If error is about missing column, retry without specialties
    if (profileError) {
      const errorMessage = profileError.message || String(profileError);
      const isColumnError = 
        errorMessage.includes("column") && 
        (errorMessage.includes("does not exist") || errorMessage.includes("specialties"));
      
      if (isColumnError) {
        // Column doesn't exist yet - fetch without it
        console.warn("specialties column not found, fetching profile without it");
        const retryResult = await supabase
          .from("profiles")
          .select("id, display_name, bio, avatar_url, created_at, is_stylist")
          .eq("id", user.id)
          .maybeSingle();
        
        profile = retryResult.data as any;
        profileError = retryResult.error;
        
        // Add null specialties to the profile
        if (profile) {
          profile = { ...profile, specialties: null } as any;
        }
      }
    }

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json(
        { ok: false, error: profileError.message },
        { status: 500 }
      );
    }

    if (!profile) {
      // Profile doesn't exist - return null profile
      return NextResponse.json(
        { ok: true, profile: null },
        { status: 200 }
      );
    }

    // Ensure specialties is always present (null if column doesn't exist or value is null)
    const profileWithSpecialties = {
      ...profile,
      specialties: profile.specialties ?? null,
    };

    return NextResponse.json(
      { ok: true, profile: profileWithSpecialties },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error in /api/profile:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
