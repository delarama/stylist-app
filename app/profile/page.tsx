export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-md bg-white px-5 pt-6 pb-24">
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-neutral-900">
        My Profile
      </h1>

      <div className="mt-6 rounded-[28px] bg-[#F4F4F4] px-5 py-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 flex-shrink-0 rounded-2xl bg-neutral-300" />
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-extrabold leading-tight text-neutral-900">
              You
            </div>
            <div className="mt-1 text-lg leading-tight text-neutral-400">
              Beauty · Skincare
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">✎</div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold leading-tight text-neutral-900">
              About
            </h2>
            <div className="text-2xl font-extrabold text-neutral-900">✎</div>
          </div>
          <p className="mt-2 text-lg leading-relaxed text-neutral-400">
            Tap edit to update your public profile.
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-extrabold leading-tight text-neutral-900">
            Reviews
          </h2>
          <p className="mt-2 text-lg leading-relaxed text-neutral-400">
            Reviews from people you've helped appear here.
          </p>
        </div>
      </div>
    </div>
  );
}