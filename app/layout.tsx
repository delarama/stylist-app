import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <main className="pb-16">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
          <div className="mx-auto flex max-w-md justify-around py-3 text-sm">
            <Link href="/" className="text-neutral-900">
              Browse
            </Link>
            <Link href="/chats" className="text-neutral-900">
              Chats
            </Link>
            <Link href="/profile" className="text-neutral-900">
              Profile
            </Link>
          </div>
        </nav>
      </body>
    </html>
  );
}