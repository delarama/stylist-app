import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const openCreatePost = requestUrl.searchParams.get("openCreatePost");

  if (!code) {
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignore in server components
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Error exchanging code for session:", error);
    return NextResponse.redirect(new URL("/signin", requestUrl.origin));
  }

  // Redirect to next URL with preserved params, or default to profile
  if (next) {
    const redirectUrl = new URL(next, requestUrl.origin);
    if (openCreatePost) {
      redirectUrl.searchParams.set("openCreatePost", openCreatePost);
    }
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(new URL("/profile", requestUrl.origin));
}
