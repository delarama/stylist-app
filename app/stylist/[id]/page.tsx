import { supabase } from "@/lib/supabase";

export default async function StylistProfilePage(props: any) {
  const id =
    typeof props?.params?.id === "string"
      ? props.params.id
      : typeof (await props?.params)?.id === "string"
      ? (await props.params).id
      : "";

  if (!id) {
    return (
      <div className="mx-auto max-w-md px-5 pt-6 pb-24 bg-white">
        <h1 className="text-2xl font-bold">Stylist not found</h1>
        <div className="mt-2 text-sm text-red-600">Missing id in route</div>
      </div>
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, display_name, headline, bio")
    .eq("id", id)
    .maybeSingle();

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-md px-5 pt-6 pb-24 bg-white">
        <h1 className="text-2xl font-bold">Stylist not found</h1>
        <div className="mt-3 text-sm text-neutral-500">
          URL id: <span className="font-mono">{id}</span>
        </div>
        {error ? (
          <div className="mt-2 text-sm text-red-600">{error.message}</div>
        ) : (
          <div className="mt-2 text-sm text-neutral-500">
            No matching row in profiles.id
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-6 pb-24 bg-white">
      <div className="rounded-[28px] bg-[#F4F4F4] p-5">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-2xl bg-neutral-300" />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-neutral-900">
              {profile.display_name}
            </h1>
            <p className="mt-1 text-lg text-neutral-400">
              {profile.headline || "Beauty · Fashion"}
            </p>
          </div>
        </div>

        {profile.bio ? (
          <p className="mt-4 text-lg text-neutral-900">{profile.bio}</p>
        ) : null}
      </div>
    </div>
  );
}