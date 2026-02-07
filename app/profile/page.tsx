export default function ProfilePage() {
    return (
      <div className="mx-auto max-w-md px-5 pt-6 pb-24 bg-white">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
          My Profile
        </h1>
  
        <div className="mt-6 rounded-[28px] bg-[#F4F4F4] p-5">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-2xl bg-neutral-300" />
            <div className="flex-1">
              <div className="text-2xl font-extrabold text-neutral-900">
                You
              </div>
              <div className="text-lg text-neutral-400">
                Beauty · Skincare
              </div>
            </div>
            <div className="text-2xl font-extrabold text-neutral-900">✎</div>
          </div>
  
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-neutral-900">
                About
              </h2>
              <div className="text-2xl font-extrabold text-neutral-900">✎</div>
            </div>
            <p className="mt-2 text-lg text-neutral-400">
              Tap edit to update your public profile.
            </p>
          </div>
  
          <div className="mt-6">
            <h2 className="text-2xl font-extrabold text-neutral-900">
              Reviews
            </h2>
            <p className="mt-2 text-lg text-neutral-400">
              Reviews from people you’ve helped appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }