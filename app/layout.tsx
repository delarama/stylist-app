import "./globals.css";
import { BottomNav } from "./components/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-neutral-100" suppressHydrationWarning>
        <div className="min-h-dvh flex justify-center">
          <div className="
            w-full
            max-w-[420px]
            md:max-w-7xl
            bg-white
            min-h-dvh
            relative
            md:bg-neutral-100
          ">
            <div className="mx-auto w-full max-w-[420px] md:max-w-7xl md:px-6 lg:px-8">
              <main className="pb-24">{children}</main>
            </div>

            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}