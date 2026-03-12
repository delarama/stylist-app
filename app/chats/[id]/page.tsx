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
import { ChatsList } from "../ChatsList";

interface Message {
  id: string;
  sender: "user" | "stylist";
  content: string | null;
  image_url: string | null;
  audio_url: string | null;
  file_url: string | null;
  file_name: string | null;
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
  const [endingChat, setEndingChat] = useState(false);
  const [endChatError, setEndChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachInputRef = useRef<HTMLInputElement>(null);
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
        file_url: null,
        file_name: null,
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
        file_url: null,
        file_name: null,
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

  const handleFileAttach = () => {
    attachInputRef.current?.click();
  };

  const handleAttachChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;

    try {
      const fileUrl = URL.createObjectURL(file);
      const message: Message = {
        id: Date.now().toString(),
        sender: "user",
        content: null,
        image_url: null,
        audio_url: null,
        file_url: fileUrl,
        file_name: file.name,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error("Error attaching file:", error);
    } finally {
      if (attachInputRef.current) attachInputRef.current.value = "";
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
          file_url: null,
          file_name: null,
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

  const handleEndChat = async () => {
    if (!chatData || endingChat) return;

    setEndingChat(true);
    setEndChatError(null);

    try {
      const res = await fetch(`/api/chats/${chatData.id}/end`, {
        method: "POST",
        credentials: "include",
      });

      const result = await res.json();

      if (!result.ok) {
        if (result.error === "INSUFFICIENT_BALANCE") {
          setEndChatError(
            `Insufficient balance. Required: $${result.required?.toFixed(2)}, available: $${result.available?.toFixed(2)}.`
          );
          return;
        }
        if (result.error === "CHAT_ALREADY_ENDED") {
          router.push("/chats");
          return;
        }
        setEndChatError("Failed to end chat. Please try again.");
        return;
      }

      setShowMenu(false);
      const elapsedSeconds =
        (Date.now() - new Date(chatData.created_at).getTime()) / 1000;

      if (elapsedSeconds < 10) {
        router.push("/chats");
      } else {
        router.push(
          `/review?chat_id=${chatData.id}&stylist_id=${chatData.stylist_id}`
        );
      }
    } catch {
      setEndChatError("Network error. Please try again.");
    } finally {
      setEndingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="lg:h-full flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (chatNotFound || !chatData) {
    return (
      <div className="lg:h-full flex flex-col items-center justify-center p-4">
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
    <>
      {/* Left Panel - Always visible on desktop, hidden on mobile */}
      <div className="hidden lg:block lg:border-r lg:border-neutral-200 lg:overflow-y-auto lg:h-full">
        <div className="px-4 pt-6 pb-6">
          <div className="grid grid-cols-3 items-center mb-4">
            <div className="justify-self-start" />
            <h1 className="justify-self-start text-lg font-semibold">Messages</h1>
            <div className="justify-self-end" />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition"
            />
          </div>
          <ChatsList />
        </div>
      </div>

      {/* Right Panel - Conversation */}
      <div className="lg:h-full lg:flex lg:flex-col min-h-screen lg:min-h-0 pb-24 lg:pb-0">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between shrink-0 bg-background/80 backdrop-blur sticky top-0 z-10 lg:relative lg:z-auto">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="lg:hidden -ml-2"
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
            <Card className="absolute right-0 mt-2 w-56 p-2 bg-white shadow-lg rounded-md border z-40">
            {endChatError && (
              <p className="px-3 py-2 text-xs text-destructive">{endChatError}</p>
            )}
            <button
              onClick={handleEndChat}
              disabled={endingChat}
              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-sm disabled:opacity-50"
            >
              {endingChat ? "Ending..." : "End chat"}
            </button>
          </Card>
          )}
        </div>
      </div>

        {/* Messages Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
          <div className="space-y-4 max-w-full">
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
                    {message.file_url && message.file_name && (
                      <div className="mb-2">
                        <a
                          href={message.file_url}
                          download={message.file_name}
                          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-black/5 transition-colors"
                        >
                          <Paperclip className="size-4 shrink-0" />
                          <span className="truncate max-w-[200px]">{message.file_name}</span>
                        </a>
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

        {/* Message Input - full width, sticky at bottom */}
        <div className="fixed lg:sticky bottom-16 lg:bottom-0 left-0 right-0 lg:left-auto lg:right-auto border-t bg-white shrink-0 w-full z-30 lg:z-auto lg:w-full">
          <div className="px-4 py-4 w-full max-w-full">
            <div className="flex gap-2 w-full">
            <div className="hidden sm:flex gap-1">
              <Button variant="ghost" size="icon" onClick={handleFileAttach}>
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
            <input
              type="file"
              ref={attachInputRef}
              className="hidden"
              onChange={handleAttachChange}
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
      </div>
    </>
  );
}
