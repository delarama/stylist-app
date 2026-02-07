import Link from "next/link";
export default function StylistProfilePage({
    params,
  }: {
    params: { id: string };
  }) {
    return (
      <div className="mx-auto max-w-md px-5 pt-6 pb-24 bg-white">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
          Stylist Profile
        </h1>
  
        <div className="mt-6 rounded-[28px] bg-[#F4F4F4] p-5">
          <div className="flex gap-4">
            <div className="h-24 w-24 rounded-2xl bg-neutral-300" />
            <div>
              <div className="text-2xl font-extrabold text-neutral-900">
                {params.id}
              </div>
              <div className="text-lg text-neutral-400">
                Beauty · Skincare
              </div>
              <div className="text-lg text-[#E6B7C2]">★★★★★</div>
            </div>
          </div>
  
          <div className="mt-5">
          <Link
                href="/chats"
                className="block w-full rounded-full bg-[#E6B7C2] py-4 text-center text-xl font-extrabold text-neutral-900"
                >
                Get advice
            </Link>
          </div>
        </div>
  
        <div className="mt-8">
          <h2 className="text-2xl font-extrabold text-neutral-900">About</h2>
          <p className="mt-2 text-lg text-neutral-400">
            Short stylist bio goes here.
          </p>
        </div>
  
        <div className="mt-8">
          <h2 className="text-2xl font-extrabold text-neutral-900">Reviews</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-[24px] bg-[#F4F4F4] p-4">
              <div className="font-semibold">Sarah</div>
              <div className="text-[#E6B7C2]">★★★★★</div>
              <p className="text-neutral-400">
                Very practical and easy to follow.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }