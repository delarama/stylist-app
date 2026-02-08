"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { Card } from "@/app/components/ui/card";

interface Message {
  id: string;
  sender: "user" | "stylist";
  content: string | null;
  image_url: string | null;
  audio_url: string | null;
  created_at: string;
}

interface ChatData {
  id: string;
  stylist_id: string;
  created_at: string;
}

export default function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const [chatId, setChatId] = useState<string>("");
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [stylistProfile, setStylistProfile] = useState<{
    display_name: string;
    headline: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [chatNotFound, setChatNotFound] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Resolve params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams =
        params instanceof Promise ? await params : params;
      setChatId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  // Load chat data and messages
  useEffect(() => {
    if (!chatId) return;

    async function loadChat() {
      try {
        // Fetch chat data
        const { data: chat, error: chatError } = await supabase
          .from("chats")
          .select("id, stylist_id, created_at")
          .eq("id", chatId)
          .maybeSingle();

        if (chatError || !chat) {
          setChatNotFound(true);
          setLoading(false);
          return;
        }

        setChatData(chat);

        // Fetch stylist profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, headline, avatar_url")
          .eq("id", chat.stylist_id)
          .maybeSingle();

        if (profile) {
          setStylistProfile(profile);
        }

        // TODO: Fetch messages from messages table when available
        // For now, use empty array
        setMessages([]);
      } catch (error) {
        console.error("Error loading chat:", error);
        setChatNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadChat();
  }, [chatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || sending) return;

    setSending(true);
    try {
      // TODO: Send message to Supabase messages table
      // For now, add to local state
      const message: Message = {
        id: Date.now().toString(),
        sender: "user",
        content: newMessage,
        image_url: null,
        audio_url: null,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      // TODO: Upload to Supabase Storage and get URL
      // For now, add to local state
      const message: Message = {
        id: Date.now().toString(),
        sender: "user",
        content: null,
        image_url: previewUrl,
        audio_url: null,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(blob);

        // TODO: Upload to Supabase Storage and get URL
        // For now, add to local state
        const message: Message = {
          id: Date.now().toString(),
          sender: "user",
          content: null,
          image_url: null,
          audio_url: audioUrl,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, message]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleEndChat = () => {
    if (!chatData) return;

    const elapsedSeconds =
      (Date.now() - new Date(chatData.created_at).getTime()) / 1000;

    if (elapsedSeconds < 10) {
      router.push("/chats");
    } else {
      router.push(
        `/review?chat_id=${chatData.id}&stylist_id=${chatData.stylist_id}`
      );
    }
    setShowMenu(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md bg-background min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (chatNotFound || !chatData) {
    return (
      <div className="mx-auto max-w-md bg-background min-h-screen px-5 py-6">
        <h1 className="text-2xl font-extrabold mb-2">Chat not found</h1>
        <p className="text-sm text-muted-foreground mb-4">
          This chat doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <Link href="/chats">Back to Chats</Link>
        </Button>
      </div>
    );
  }

  const stylistName = stylistProfile?.display_name || "Stylist";
  const stylistAvatar = stylistProfile?.avatar_url || null;
  const stylistHeadline = stylistProfile?.headline || "Beauty · Fashion";

  return (
    <div className="mx-auto max-w-md bg-background min-h-screen flex flex-col">
      {/* Chat Header - matches Figma */}
      <div className="p-4 border-b flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="sm:hidden -ml-2"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="relative">
            <Avatar className="w-10 h-10">
              {stylistAvatar ? (
                <AvatarImage src={stylistAvatar} alt={stylistName} />
              ) : null}
              <AvatarFallback>{stylistName[0]?.toUpperCase() || "S"}</AvatarFallback>
            </Avatar>
            {/* TODO: Add online status indicator when available */}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-medium">{stylistName}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {stylistHeadline}
            </p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical className="size-4" />
          </Button>
          {showMenu && (
            <Card className="absolute right-0 mt-2 w-48 p-2 bg-white shadow-lg rounded-md border z-40">
            <button
              onClick={handleEndChat}
              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-sm"
            >
              End chat
            </button>
          </Card>
          )}
        </div>
      </div>

      {/* Messages - matches Figma */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-36">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.image_url && (
                    <div className="mb-2">
                      <img
                        src={message.image_url}
                        alt="Uploaded photo"
                        className="rounded-lg max-w-full h-auto"
                      />
                    </div>
                  )}
                  {message.audio_url && (
                    <div className="mb-2">
                      <audio controls src={message.audio_url} className="w-full" />
                    </div>
                  )}
                  {message.content && (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - matches Figma, fixed above bottom nav */}
      <div 
        className="fixed bottom-16 left-0 right-0 border-t bg-white z-30"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        <div className="mx-auto max-w-md px-5 py-4">
          <div className="flex gap-2">
            <div className="hidden sm:flex gap-1">
              <Button variant="ghost" size="icon">
                <Paperclip className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handlePhotoUpload}>
                <ImageIcon className="size-4" />
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 h-10 sm:h-11"
              disabled={sending}
            />
            {recording ? (
              <Button
                onClick={handleStopRecording}
                size="icon"
                variant="destructive"
                className="h-10 w-10 sm:h-11 sm:w-11 shrink-0"
              >
                <Mic className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={newMessage.trim() ? handleSendMessage : handleStartRecording}
                size="icon"
                className="h-10 w-10 sm:h-11 sm:w-11 shrink-0"
                disabled={sending}
              >
                {newMessage.trim() ? (
                  <Send className="size-4" />
                ) : (
                  <Mic className="size-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
