import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "NOT_SIGNED_IN" },
        { status: 401 }
      );
    }

    // Query posts table with join to profiles
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(`
        id,
        created_at,
        caption,
        media_url,
        media_type,
        like_count,
        author:profiles!author_id (
          id,
          display_name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

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
      created_at: post.created_at,
      caption: post.caption,
      media_url: post.media_url,
      media_type: post.media_type,
      like_count: post.like_count,
      author: post.author || null,
    }));

    return NextResponse.json(
      { ok: true, posts: transformedPosts },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error in /api/feed:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
