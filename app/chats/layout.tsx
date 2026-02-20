import { ReactNode } from "react";

export default function ChatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full">
      <div className="mx-auto w-full max-w-[420px] md:max-w-7xl md:px-6 lg:px-8">
        {/* Desktop: 2-column layout, Mobile: single column */}
        <div className="lg:grid lg:grid-cols-2 lg:h-[calc(100vh-72px)] lg:gap-0 lg:border lg:border-neutral-200 lg:rounded-lg lg:overflow-hidden lg:bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
