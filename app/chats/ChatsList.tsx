"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { formatRelativeTime } from "@/lib/date-utils";
import { supabase } from "@/lib/supabase";
import { Button } from "@/app/components/ui/button";

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

interface ChatsListProps {
  onChatSelect?: (chatId: string) => void;
}

export function ChatsList({ onChatSelect }: ChatsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChats() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
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

        if (!data.ok) {
          setError(data.error || "Failed to load chats");
          return;
        }

        const fetchedChats = data.chats || [];
        setChats(fetchedChats);

        // On desktop, if no chat is selected and we have chats, select the first one
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
          if (pathname === "/chats" && fetchedChats.length > 0 && onChatSelect) {
            onChatSelect(fetchedChats[0].id);
          }
        }
      } catch (err) {
        setError("Failed to load chats");
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, [pathname, onChatSelect]);

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
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
    );
  }

  if (chats.length === 0) {
    return (
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
    );
  }

  return (
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
  );
}
