import Link from "next/link";

import { supabase } from "@/lib/supabase";
export default function BrowsePage() {

  return (
    <div className="mx-auto max-w-md bg-white px-5 pt-6 pb-24">
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-neutral-900">
        Browse Stylists
      </h1>
      <p className="mt-2 text-lg text-neutral-400">
        Beauty & fashion advice
      </p>

      <div className="mt-5 flex gap-3">
        <span className="rounded-full bg-[#E6B7C2] px-6 py-3 text-lg font-medium text-neutral-900">
          All
        </span>
        <span className="rounded-full bg-[#F3F3F3] px-6 py-3 text-lg font-medium text-neutral-900">
          Beauty
        </span>
        <span className="rounded-full bg-[#F3F3F3] px-6 py-3 text-lg font-medium text-neutral-900">
          Fashion
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {/* Maya */}
        <div className="flex items-center gap-4 rounded-[28px] bg-[#F4F4F4] px-5 py-6 shadow-sm">
          <Link href="/stylist/maya" className="flex flex-1 items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-neutral-300" />
            <div className="min-w-0 flex-1">
              <div className="text-2xl font-extrabold leading-tight text-neutral-900">
                Maya R.
              </div>
              <div className="mt-1 text-lg leading-tight text-neutral-400">
                Beauty · Skincare
              </div>
              <div className="mt-1.5 text-lg leading-none text-[#E6B7C2]">
                ★★★★★
              </div>
            </div>
          </Link>

          <Link
            href="/chats/maya"
            className="flex-shrink-0 rounded-full bg-[#E6B7C2] px-5 py-2.5 text-base font-semibold text-neutral-900 active:opacity-90"
          >
            Get advice
          </Link>
        </div>

        {/* Elena */}
        <div className="flex items-center gap-4 rounded-[28px] bg-[#F4F4F4] px-5 py-6 shadow-sm">
          <Link href="/stylist/elena" className="flex flex-1 items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-neutral-300" />
            <div className="min-w-0 flex-1">
              <div className="text-2xl font-extrabold leading-tight text-neutral-900">
                Elena K.
              </div>
              <div className="mt-1 text-lg leading-tight text-neutral-400">
                Fashion · Styling
              </div>
              <div className="mt-1.5 text-lg leading-none">
                <span className="text-[#E6B7C2]">★★★★</span>
                <span className="text-neutral-200">★</span>
              </div>
            </div>
          </Link>

          <Link
            href="/chats/elena"
            className="flex-shrink-0 rounded-full bg-[#E6B7C2] px-5 py-2.5 text-base font-semibold text-neutral-900 active:opacity-90"
          >
            Get advice
          </Link>
        </div>

        {/* Sofia */}
        <div className="flex items-center gap-4 rounded-[28px] bg-[#F4F4F4] px-5 py-6 shadow-sm">
          <Link href="/stylist/sofia" className="flex flex-1 items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-neutral-300" />
            <div className="min-w-0 flex-1">
              <div className="text-2xl font-extrabold leading-tight text-neutral-900">
                Sofia L.
              </div>
              <div className="mt-1 text-lg leading-tight text-neutral-400">
                Beauty · Makeup
              </div>
              <div className="mt-1.5 text-lg leading-none text-[#E6B7C2]">
                ★★★★★
              </div>
            </div>
          </Link>

          <Link
            href="/chats/sofia"
            className="flex-shrink-0 rounded-full bg-[#E6B7C2] px-5 py-2.5 text-base font-semibold text-neutral-900 active:opacity-90"
          >
            Get advice
          </Link>
        </div>
      </div>
    </div>
  );
}