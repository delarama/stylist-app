export default function ChatConversationPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mx-auto max-w-md bg-white">
      <div className="border-b bg-white px-5 pt-6 pb-4">
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-neutral-900">
          {params.id}
        </h1>
        <p className="mt-1 text-lg leading-tight text-neutral-400">
          Beauty · Skincare
        </p>
      </div>

      <div className="px-5 pb-32 pt-6 space-y-4">
        <div className="max-w-[80%] rounded-[28px] bg-[#F4F4F4] px-5 py-4 shadow-sm">
          <p className="text-lg leading-relaxed text-neutral-900">
            Tell me about your skin concerns.
          </p>
        </div>

        <div className="ml-auto max-w-[80%] rounded-[28px] bg-[#E6B7C2] px-5 py-4 shadow-sm">
          <p className="text-lg leading-relaxed text-neutral-900">
            Dryness and acne.
          </p>
        </div>

        <div className="ml-auto max-w-[70%] rounded-[28px] bg-[#E6B7C2] px-5 py-4 shadow-sm">
          <div className="h-40 rounded-2xl bg-neutral-200" />
          <p className="mt-3 text-lg leading-relaxed text-neutral-900">
            [Photo]
          </p>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 border-t bg-white">
        <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-4">
          <div className="flex-1 rounded-full border border-neutral-200 bg-white px-5 py-3 text-base text-neutral-400">
            Message
          </div>

          <button
            aria-label="Add photo"
            className="h-12 w-12 flex-shrink-0 rounded-full border border-neutral-200 bg-white active:opacity-90"
          />
          <button
            aria-label="Voice"
            className="h-12 w-12 flex-shrink-0 rounded-full border border-neutral-200 bg-white active:opacity-90"
          />
          <button
            aria-label="Send"
            className="h-12 w-12 flex-shrink-0 rounded-full bg-[#E6B7C2] active:opacity-90"
          />
        </div>
      </div>
    </div>
  );
}