import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function BrowsePage() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const items = (data ?? []).filter((p: any) => !!p.id);

  return (
    <div className="mx-auto max-w-md px-5 pt-6 pb-24 bg-white">
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
        Browse Stylists
      </h1>
      <p className="mt-2 text-lg text-neutral-400">Beauty & fashion advice</p>

      <div className="mt-5 flex gap-3">
        <span className="rounded-full bg-[#E6B7C2] px-6 py-3 text-lg font-medium">
          All
        </span>
        <span className="rounded-full bg-[#F4F4F4] px-6 py-3 text-lg font-medium">
          Beauty
        </span>
        <span className="rounded-full bg-[#F4F4F4] px-6 py-3 text-lg font-medium">
          Fashion
        </span>
      </div>

      {error ? (
        <div className="mt-6 rounded-[28px] bg-[#F4F4F4] p-5 text-neutral-900">
          <div className="text-xl font-bold">Couldn’t load stylists</div>
          <div className="mt-2 text-sm text-neutral-500">{error.message}</div>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-[28px] bg-[#F4F4F4] p-5 text-neutral-900">
          <div className="text-xl font-bold">No stylists yet</div>
          <div className="mt-2 text-lg text-neutral-400">
            Your profiles table returned no rows with an id.
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {items.map((p: any) => {
            const id = String(p.id);
            const name = p.display_name || "Unnamed stylist";
            const subtitle = p.headline || "Beauty · Fashion";

            return (
              <div
                key={id}
                className="flex items-center gap-4 rounded-[28px] bg-[#F4F4F4] px-5 py-5"
              >
                <Link
                  href={`/stylist/${id}`}
                  className="flex flex-1 items-center gap-4"
                >
                  <div className="h-20 w-20 rounded-2xl bg-neutral-300" />
                  <div>
                    <div className="text-2xl font-extrabold text-neutral-900">
                      {name}
                    </div>
                    <div className="text-lg text-neutral-400">{subtitle}</div>
                    <div className="text-lg text-[#E6B7C2]">★★★★★</div>

                    {/* temporary debug so we can confirm ids */}

                  </div>
                </Link>

                <Link
                  href={`/chats/${id}`}
                  className="rounded-full bg-[#E6B7C2] px-5 py-2.5 text-base font-semibold whitespace-nowrap text-neutral-900"
                >
                  Get advice
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}