"use client";

import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-6 pb-24 bg-white">
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
        Profile
      </h1>

      <button
        onClick={signInWithGoogle}
        className="mt-8 w-full rounded-full bg-[#E6B7C2] py-4 text-center text-xl font-extrabold text-neutral-900"
      >
        Sign in with Google
      </button>
    </div>
  );
}