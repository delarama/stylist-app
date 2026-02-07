import "./globals.css";
import { BottomNav } from "./components/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <main className="pb-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}