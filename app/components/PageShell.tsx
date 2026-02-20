import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  header?: {
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    sticky?: boolean;
  };
}

export function PageShell({ children, className = "", header }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {header && (
        <div
          className={`border-b bg-background/80 backdrop-blur-sm z-10 shrink-0 ${
            header.sticky !== false ? "sticky top-0" : ""
          }`}
        >
          <div className="px-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center py-4">
              <div className="flex items-center justify-start">{header.left}</div>
              <div className="flex items-center justify-center">{header.center}</div>
              <div className="flex items-center justify-end">{header.right}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 px-4 ${className}`}>{children}</div>
    </div>
  );
}
