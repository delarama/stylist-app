import Link from "next/link";

export default function StylistProfilePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mx-auto max-w-md bg-white px-5 pt-6 pb-24">
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-neutral-900">
        Stylist Profile
      </h1>

      <div className="mt-6 rounded-[28px] bg-[#F4F4F4] px-5 py-6 shadow-sm">
        <div className="flex gap-4">
          <div className="h-24 w-24 flex-shrink-0 rounded-2xl bg-neutral-300" />
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-extrabold leading-tight text-neutral-900">
              {params.id}
            </div>
            <div className="mt-1 text-lg leading-tight text-neutral-400">
              Beauty · Skincare
            </div>
            <div className="mt-1.5 text-lg leading-none text-[#E6B7C2]">
              ★★★★★
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/chats"
            className="block w-full rounded-full bg-[#E6B7C2] py-4 text-center text-xl font-extrabold text-neutral-900 active:opacity-90"
          >
            Get advice
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-extrabold leading-tight text-neutral-900">
          About
        </h2>
        <p className="mt-2 text-lg leading-relaxed text-neutral-400">
          Short stylist bio goes here.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-extrabold leading-tight text-neutral-900">
          Reviews
        </h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-[24px] bg-[#F4F4F4] px-5 py-5 shadow-sm">
            <div className="text-lg font-semibold text-neutral-900">Sarah</div>
            <div className="mt-1.5 text-lg leading-none text-[#E6B7C2]">
              ★★★★★
            </div>
            <p className="mt-2 text-base leading-relaxed text-neutral-400">
              Very practical and easy to follow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}