import { NextResponse } from "next/server";
import { createSupabaseAnonServerClient } from "@/lib/supabaseAnonServer";

/**
 * GET /api/posts
 * 
 * Public endpoint - no authentication required.
 * Returns posts with author profile information.
 * 
 * RLS Policies Required (in Supabase):
 * - posts table: Allow SELECT for everyone (public/anonymous users)
 * - profiles table: Allow SELECT for everyone, but only expose:
 *   - id, display_name, avatar_url (columns needed by the feed)
 */
export async function GET(request: Request) {
  try {
    // Use public anon client - no authentication required for reading posts
    // This client uses the anon key and works without user authentication
    const supabase = createSupabaseAnonServerClient();

    // Get author_id from query params if provided
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("author_id");

    // Query posts with author profile join using explicit foreign key reference
    let query = supabase
      .from("posts")
      .select(`
        id,
        image_url,
        title,
        description,
        tags,
        created_at,
        author_id,
        author:profiles!posts_author_id_fkey (
          id,
          display_name,
          avatar_url
        )
      `);

    // Filter by author_id if provided
    if (authorId) {
      query = query.eq("author_id", authorId);
    }

    const { data: posts, error: postsError } = await query
      .order("created_at", { ascending: false })
      .limit(50);

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      return NextResponse.json(
        { ok: false, error: postsError.message, details: postsError },
        { status: 500 }
      );
    }

    if (!posts) {
      return NextResponse.json(
        { ok: false, error: "Posts data is null" },
        { status: 500 }
      );
    }

    // Transform the data to flatten the author object
    const transformedPosts = posts.map((post: any) => ({
      id: post.id,
      image_url: post.image_url,
      title: post.title || null,
      description: post.description || null,
      tags: post.tags || [],
      created_at: post.created_at,
      author_id: post.author_id,
      author: post.author || null,
    }));

    return NextResponse.json(
      { ok: true, posts: transformedPosts },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error in /api/posts:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
