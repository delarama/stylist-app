import Link from "next/link";

export default function ChatsPage() {
  return (
    <div className="mx-auto max-w-md bg-white px-5 pt-6 pb-24">
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-neutral-900">
        Chats
      </h1>

      <div className="mt-6 space-y-5">
        <Link
          href="/chats/maya"
          className="block rounded-[28px] bg-[#F4F4F4] px-5 py-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-neutral-300" />
            <div className="min-w-0 flex-1">
              <div className="text-2xl font-extrabold leading-tight text-neutral-900">
                Maya R.
              </div>
              <div className="mt-1 text-lg leading-tight text-neutral-900">
                Tell me more about your routine…
              </div>
            </div>
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#E6B7C2]" />
          </div>
        </Link>

        <Link
          href="/chats/elena"
          className="block rounded-[28px] bg-[#F4F4F4] px-5 py-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-neutral-300" />
            <div className="min-w-0 flex-1">
              <div className="text-2xl font-extrabold leading-tight text-neutral-900">
                Elena K.
              </div>
              <div className="mt-1 text-lg leading-tight text-neutral-400">
                I recommend starting with…
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/chats/sofia"
          className="block rounded-[28px] bg-[#F4F4F4] px-5 py-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-neutral-300" />
            <div className="min-w-0 flex-1">
              <div className="text-2xl font-extrabold leading-tight text-neutral-900">
                Sofia L.
              </div>
              <div className="mt-1 text-lg leading-tight text-neutral-900">
                Voice message
              </div>
            </div>
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#E6B7C2]" />
          </div>
        </Link>
      </div>
    </div>
  );
}