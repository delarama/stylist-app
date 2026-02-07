import { ArrowLeft, Send, Paperclip, Image as ImageIcon, Smile, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: number;
  sender: "user" | "stylist";
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: number;
  stylistName: string;
  stylistAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

const conversations: Conversation[] = [
  {
    id: 1,
    stylistName: "Sophia Martinez",
    stylistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    lastMessage: "I'd love to work with you! When are you free?",
    timestamp: "2m ago",
    unread: 2,
    online: true
  },
  {
    id: 2,
    stylistName: "Isabella Chen",
    stylistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    lastMessage: "Thanks for reaching out! Let me send you some portfolio...",
    timestamp: "1h ago",
    unread: 0,
    online: true
  },
  {
    id: 3,
    stylistName: "Emma Johnson",
    stylistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastMessage: "Perfect! I'll see you then.",
    timestamp: "3h ago",
    unread: 0,
    online: false
  },
  {
    id: 4,
    stylistName: "Olivia Williams",
    stylistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    lastMessage: "That sounds great! I have availability next week.",
    timestamp: "1d ago",
    unread: 0,
    online: false
  }
];

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "user",
    content: "Hi Sophia! I saw your portfolio and I'm interested in booking a balayage appointment.",
    timestamp: "10:30 AM",
    read: true
  },
  {
    id: 2,
    sender: "stylist",
    content: "Hi! Thank you so much for reaching out! I'd love to work with you. What look are you going for?",
    timestamp: "10:32 AM",
    read: true
  },
  {
    id: 3,
    sender: "user",
    content: "I'm looking for a warm caramel balayage, something natural-looking. I have medium brown hair right now.",
    timestamp: "10:35 AM",
    read: true
  },
  {
    id: 4,
    sender: "stylist",
    content: "That would look beautiful! Caramel tones work wonderfully with medium brown hair. I'd recommend a consultation first so we can discuss the perfect shade for your skin tone.",
    timestamp: "10:37 AM",
    read: true
  },
  {
    id: 5,
    sender: "stylist",
    content: "When are you free for an appointment? I have openings next Tuesday and Thursday.",
    timestamp: "10:38 AM",
    read: false
  }
];

interface ChatProps {
  onBack: () => void;
  onEndChat?: (stylistId: number) => void;
  userBalance: number;
  onShowPaywall?: () => void;
}

export function Chat({ onBack, onEndChat, userBalance, onShowPaywall }: ChatProps) {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  const handleConversationClick = (id: number) => {
    setSelectedChat(id);
    setShowMobileChat(true);
  };

  const handleMobileBack = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Conversations List */}
      <div className={`${showMobileChat ? 'hidden' : 'flex'} sm:flex w-full sm:w-80 border-r flex-col`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Messages</h2>
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
          </div>
          <Input placeholder="Search messages..." className="h-10" />
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={`w-full p-4 rounded-lg text-left transition-colors mb-1 ${
                  selectedChat === conversation.id 
                    ? 'bg-muted' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.stylistAvatar} alt={conversation.stylistName} />
                      <AvatarFallback>{conversation.stylistName[0]}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="truncate">{conversation.stylistName}</h4>
                      <span className="text-xs text-muted-foreground ml-2 shrink-0">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="ml-2 shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={`${showMobileChat ? 'flex' : 'hidden'} sm:flex flex-1 flex-col`}>
        {/* Chat Header */}
        {selectedConversation && (
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleMobileBack}
                className="sm:hidden -ml-2"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation.stylistAvatar} alt={selectedConversation.stylistName} />
                  <AvatarFallback>{selectedConversation.stylistName[0]}</AvatarFallback>
                </Avatar>
                {selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <h3 className="text-sm sm:text-base">{selectedConversation.stylistName}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {selectedConversation.online ? 'Active now' : 'Offline'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEndChat?.(selectedChat)}
            >
              <MoreVertical className="size-4" />
            </Button>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 sm:p-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-3 sm:p-4 border-t">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="hidden sm:flex gap-1">
                <Button variant="ghost" size="icon">
                  <Paperclip className="size-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Smile className="size-4" />
                </Button>
              </div>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 h-10 sm:h-11"
              />
              <Button onClick={handleSendMessage} size="icon" className="h-10 w-10 sm:h-11 sm:w-11 shrink-0">
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}