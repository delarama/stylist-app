"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { formatRelativeTime } from "@/lib/date-utils";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

interface Chat {
  id: string;
  stylist_id: string;
  created_at: string;
  stylist?: {
    display_name: string;
    headline: string | null;
    avatar_url: string | null;
  };
}

export default function ChatsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchChats() {
      try {
        // Get session to extract access token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (cancelled) return;

        if (sessionError || !session?.access_token) {
          setError("Please sign in to view your messages");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/chats", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          }
        });
        const data = await res.json();

        if (cancelled) return;

        if (!data.ok) {
          setError(data.error || "Failed to load chats");
          return;
        }

        const fetchedChats = data.chats || [];
        setChats(fetchedChats);

        // On desktop, if no chat is selected and we have chats, redirect to most recent
        if (
          !cancelled &&
          typeof window !== "undefined" &&
          window.innerWidth >= 1024 &&
          pathname === "/chats" &&
          fetchedChats.length > 0
        ) {
          try {
            router.replace(`/chats/${fetchedChats[0].id}`);
          } catch {
            // Navigation failed — stay on /chats
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load chats");
          console.error("Error fetching chats:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchChats();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Left Panel - Always visible on desktop */}
      <div className="lg:border-r lg:border-neutral-200 lg:overflow-y-auto lg:h-full">
        <div className="px-4 pt-6 pb-24 lg:pb-6">
        {/* Header with 3-column grid */}
        <div className="grid grid-cols-3 items-center mb-4">
          <button
            onClick={() => router.back()}
            className="justify-self-start p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors lg:hidden"
          >
            <ArrowLeft className="size-4" />
          </button>
          <h1 className="justify-self-center text-lg font-semibold lg:justify-self-start">Messages</h1>
          <div className="justify-self-end" />
        </div>

        {/* Search bar - full width */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition"
          />
        </div>

        {/* Chats List */}
        {loading ? (
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-neutral-200 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-1/3" />
                    <div className="h-3 bg-neutral-200 rounded w-2/3" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-900">
              {error === "Please sign in to view your messages" ? "Please sign in" : "Error"}
            </h3>
            <p className="text-sm text-neutral-500 mb-4">
              {error === "Please sign in to view your messages" 
                ? "Sign in to view your messages and start conversations with stylists."
                : error}
            </p>
            {error === "Please sign in to view your messages" && (
              <Button onClick={() => router.push("/signin")}>
                Sign In
              </Button>
            )}
          </div>
        ) : chats.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-900">No messages yet</h3>
            <p className="text-sm text-neutral-500">
              Start a conversation with a stylist to see your chats here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {chats.map((chat) => {
              const stylistName = chat.stylist?.display_name || "Unknown Stylist";
              const stylistAvatar = chat.stylist?.avatar_url || null;
              const lastMessage = chat.stylist?.headline || "Tap to chat";
              const timestamp = formatRelativeTime(chat.created_at);

              const isActive = pathname === `/chats/${chat.id}`;
              return (
                <li key={chat.id}>
                  <Link
                    href={`/chats/${chat.id}`}
                    className={`flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 hover:bg-neutral-50 transition ${
                      isActive ? "bg-neutral-50 border-primary/20" : ""
                    }`}
                  >
                    {stylistAvatar ? (
                      <img
                        src={stylistAvatar}
                        alt={stylistName}
                        className="w-12 h-12 rounded-full shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-200 shrink-0 flex items-center justify-center">
                        <span className="text-neutral-600 font-medium">
                          {stylistName[0]?.toUpperCase() || "S"}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="truncate font-medium text-neutral-900">
                          {stylistName}
                        </div>
                        <div className="text-xs text-neutral-500 shrink-0">
                          {timestamp}
                        </div>
                      </div>
                      <div className="truncate text-sm text-neutral-500">
                        {lastMessage}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        </div>
      </div>

      {/* Right Panel - Empty state on desktop when no chat selected */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:h-full lg:border-l lg:border-neutral-200">
        <div className="text-center">
          <p className="text-sm text-neutral-500">Select a conversation to start chatting</p>
        </div>
      </div>
    </>
  );
}
