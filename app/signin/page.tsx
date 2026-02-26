"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // If signed in, redirect to next URL or profile
        const next = searchParams.get("next");
        if (next) {
          const openCreatePost = searchParams.get("openCreatePost");
          const redirectUrl = openCreatePost ? `${next}?openCreatePost=1` : next;
          router.replace(redirectUrl);
        } else {
          router.push("/profile");
        }
        return;
      }

      setLoading(false);
    }

    checkAuth();
  }, [router, searchParams]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      // Preserve next and openCreatePost params in the callback URL
      const next = searchParams.get("next");
      const openCreatePost = searchParams.get("openCreatePost");
      const callbackParams = new URLSearchParams();
      if (next) callbackParams.set("next", next);
      if (openCreatePost) callbackParams.set("openCreatePost", openCreatePost);
      
      const callbackUrl = callbackParams.toString()
        ? `${window.location.origin}/auth/callback?${callbackParams.toString()}`
        : `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error);
        setSigningIn(false);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md min-h-screen flex items-center justify-center px-4 pb-24">
      <Card className="w-full p-6 sm:p-8">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Continue with your Google account to get started
            </p>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            size="lg"
            className="w-full gap-2"
          >
            {signingIn ? (
              "Signing in..."
            ) : (
              <>
                <svg
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
