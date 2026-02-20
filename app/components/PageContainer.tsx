import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[420px] lg:max-w-6xl px-4 sm:px-6 lg:px-8 pb-24 ${className}`}>
      {children}
    </div>
  );
}
