"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Search, MessageCircle, Wallet, User, Plus } from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { useState, useEffect } from "react";
import { CreatePostModal } from "./CreatePostModal";
import { supabase } from "@/lib/supabase";

export function BottomNav() {
  const pathname = usePathname();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsSignedIn(!!user);
    }
    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { href: "/", label: "Feed", icon: LayoutGrid },
    { href: "/browse", label: "Browse", icon: Search },
  ];

  const rightNavItems = [
    { href: "/chats", label: "Chats", icon: MessageCircle },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: isSignedIn ? "/profile" : "/signin", label: "Profile", icon: User },
  ];

  const handlePostSuccess = () => {
    // Trigger a custom event that the feed can listen to
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("refreshFeed"));
    }
  };

  const handleCreatePostClick = async () => {
    // If auth state is still loading, check directly
    if (isSignedIn === null) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/signin?next=/&openCreatePost=1";
        return;
      }
    } else if (isSignedIn === false) {
      // Not signed in - redirect to signin with return URL
      window.location.href = "/signin?next=/&openCreatePost=1";
      return;
    }
    // Signed in - open modal
    setIsCreateModalOpen(true);
  };

  // Hide nav inside an individual chat thread or when create-post modal is open
  const isIndividualChat = pathname.startsWith("/chats/") && pathname !== "/chats";
  const hideNav = isIndividualChat || isCreateModalOpen;

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-1/2 -translate-x-1/2",
          "w-full max-w-[420px]",
          "md:max-w-7xl",
          "border-t bg-white/90 backdrop-blur",
          "supports-[backdrop-filter]:bg-white/70",
          "z-50 transition-transform duration-200",
          hideNav && "translate-y-full pointer-events-none",
        )}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
      >
        <div className="flex justify-around items-center h-[72px]">
          {/* Left items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              item.href === "/" 
                ? pathname === "/"
                : pathname === item.href || pathname?.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("size-5", isActive && "text-primary")} />
                <span className={cn(isActive && "font-medium")}>{item.label}</span>
              </Link>
            );
          })}

          {/* Center: Create Post Button (Mobile) */}
          <button
            onClick={handleCreatePostClick}
            className="lg:hidden flex flex-col items-center justify-center gap-1 px-4 text-xs transition-colors text-primary"
          >
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Plus className="size-5" />
            </div>
            <span className="font-medium">Create</span>
          </button>

          {/* Right items */}
          {rightNavItems.map((item) => {
            const Icon = item.icon;
            // For Profile, check both /profile and /signin as active
            const isActive = item.label === "Profile"
              ? pathname === "/profile" || pathname === "/signin"
              : pathname === item.href || pathname?.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("size-5", isActive && "text-primary")} />
                <span className={cn(isActive && "font-medium")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Create Button (Desktop) */}
      {!isIndividualChat && (
        <button
          onClick={handleCreatePostClick}
          className="hidden lg:flex fixed bottom-24 right-8 size-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow items-center justify-center z-40"
          style={{ marginBottom: "calc(env(safe-area-inset-bottom, 0px))" }}
        >
          <Plus className="size-6" />
        </button>
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handlePostSuccess}
      />
    </>
  );
}
