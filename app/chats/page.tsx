"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Card } from "@/app/components/ui/card";
import { formatRelativeTime } from "@/lib/date-utils";

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
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch("/api/chats", {
          credentials: "include",
        });
        const data = await res.json();

        if (!data.ok) {
          setError(data.error || "Failed to load chats");
          return;
        }

        setChats(data.chats || []);
      } catch (err) {
        setError("Failed to load chats");
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, []);

  return (
    <div className="mx-auto max-w-md bg-white min-h-screen flex flex-col pb-24">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Messages</h2>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="size-4" />
            </Button>
          </div>
          <Input placeholder="Search messages..." className="h-10" />
        </div>
      </div>

      {/* Chats List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Card className="p-4 m-2">
              <p className="text-sm text-destructive">{error}</p>
            </Card>
          ) : chats.length === 0 ? (
            <Card className="p-8 text-center m-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
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
              <h3 className="text-lg font-semibold mb-2 text-foreground">No messages yet</h3>
              <p className="text-sm text-muted-foreground">
                Start a conversation with a stylist to see your chats here.
              </p>
            </Card>
          ) : (
            <>
              {chats.map((chat) => {
                const stylistName = chat.stylist?.display_name || "Unknown Stylist";
                const stylistAvatar = chat.stylist?.avatar_url || null;
                const lastMessage = chat.stylist?.headline || "No messages yet";
                const timestamp = formatRelativeTime(chat.created_at);

                return (
                  <Link key={chat.id} href={`/chats/${chat.id}`}>
                    <button
                      className="w-full p-4 rounded-lg text-left transition-colors mb-1 hover:bg-muted/50"
                    >
                      <div className="flex gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            {stylistAvatar ? (
                              <AvatarImage src={stylistAvatar} alt={stylistName} />
                            ) : null}
                            <AvatarFallback>{stylistName[0]?.toUpperCase() || "S"}</AvatarFallback>
                          </Avatar>
                          {/* TODO: Add online status indicator when available */}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="truncate">{stylistName}</h4>
                            <span className="text-xs text-muted-foreground ml-2 shrink-0">
                              {timestamp}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {lastMessage}
                            </p>
                            {/* TODO: Add unread badge when available */}
                          </div>
                        </div>
                      </div>
                    </button>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
