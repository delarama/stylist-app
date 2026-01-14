import Link from "next/link";

export default function BrowsePage() {
  return (
    <div className="mx-auto max-w-md px-5 pt-6 pb-24 bg-white">
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
        Browse Stylists
      </h1>
      <p className="mt-2 text-lg text-neutral-400">
        Beauty & fashion advice
      </p>

      <div className="mt-5 flex gap-3">
        <span className="rounded-full bg-[#E6B7C2] px-6 py-3 text-lg font-medium">
          All
        </span>
        <span className="rounded-full bg-[#F3F3F3] px-6 py-3 text-lg font-medium">
          Beauty
        </span>
        <span className="rounded-full bg-[#F3F3F3] px-6 py-3 text-lg font-medium">
          Fashion
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {/* Maya */}
        <div className="flex items-center gap-4 rounded-[28px] bg-[#F4F4F4] px-5 py-5">
          <Link href="/stylist/maya" className="flex flex-1 items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-neutral-300" />
            <div>
              <div className="text-2xl font-extrabold">Maya R.</div>
              <div className="text-lg text-neutral-400">
                Beauty · Skincare
              </div>
              <div className="text-lg text-[#E6B7C2]">★★★★★</div>
            </div>
          </Link>

          <Link
            href="/chats/maya"
            className="rounded-full bg-[#E6B7C2] px-8 py-4 text-xl font-extrabold"
          >
            Get advice
          </Link>
        </div>

        {/* Elena */}
        <div className="flex items-center gap-4 rounded-[28px] bg-[#F4F4F4] px-5 py-5">
          <Link href="/stylist/elena" className="flex flex-1 items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-neutral-300" />
            <div>
              <div className="text-2xl font-extrabold">Elena K.</div>
              <div className="text-lg text-neutral-400">
                Fashion · Styling
              </div>
              <div className="text-lg">
                <span className="text-[#E6B7C2]">★★★★</span>
                <span className="text-neutral-200">★</span>
              </div>
            </div>
          </Link>

          <Link
            href="/chats/elena"
            className="rounded-full bg-[#E6B7C2] px-8 py-4 text-xl font-extrabold"
          >
            Get advice
          </Link>
        </div>

        {/* Sofia */}
        <div className="flex items-center gap-4 rounded-[28px] bg-[#F4F4F4] px-5 py-5">
          <Link href="/stylist/sofia" className="flex flex-1 items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-neutral-300" />
            <div>
              <div className="text-2xl font-extrabold">Sofia L.</div>
              <div className="text-lg text-neutral-400">
                Beauty · Makeup
              </div>
              <div className="text-lg text-[#E6B7C2]">★★★★★</div>
            </div>
          </Link>

          <Link
            href="/chats/sofia"
            className="rounded-full bg-[#E6B7C2] px-8 py-4 text-xl font-extrabold"
          >
            Get advice
          </Link>
        </div>
      </div>
    </div>
  );
}