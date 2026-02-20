import { useState } from "react";
import { Home, MessageCircle, Wallet as WalletIcon, User, Search } from "lucide-react";
import { StylistBrowse } from "./components/stylist-browse";
import { StylistProfile } from "./components/stylist-profile";
import { SocialFeed } from "./components/social-feed";
import { Chat } from "./components/chat";
import { Wallet } from "./components/wallet";
import { UserProfile } from "./components/user-profile";
import { RateReview } from "./components/rate-review";
import { Paywall } from "./components/paywall";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

type View = "feed" | "browse" | "profile" | "chat" | "wallet" | "user-profile";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("feed");
  const [selectedStylistId, setSelectedStylistId] = useState<number | null>(null);
  const [userBalance, setUserBalance] = useState(25.00); // Low balance to demo paywall
  const [showRateReview, setShowRateReview] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [stylistToRate, setStylistToRate] = useState<{ id: number; name: string; avatar: string } | null>(null);
  
  // User stylist info (for post creation)
  const [currentUserIsStylist, setCurrentUserIsStylist] = useState(true); // Demo: user is a stylist
  const [currentUserName] = useState("Jessica Anderson");
  const [currentUserSpecialty] = useState("Hair & Color Specialist");
  
  const unreadMessages = 2;
  const minimumChatBalance = 50.00; // Minimum required to start chat

  const handleStylistClick = (id: number) => {
    setSelectedStylistId(id);
    setCurrentView("profile");
  };

  const handleChatClick = () => {
    // Check if user has enough balance to start a NEW chat
    if (userBalance < minimumChatBalance) {
      setShowPaywall(true);
    } else {
      setCurrentView("chat");
      toast.success("Chat started! Balance will be deducted.");
    }
  };

  const handleBackToBrowse = () => {
    setCurrentView("browse");
    setSelectedStylistId(null);
  };

  const handleEndChat = (stylistId: number) => {
    // Show rate and review modal
    const stylist = {
      id: stylistId,
      name: "Sophia Martinez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia"
    };
    setStylistToRate(stylist);
    setShowRateReview(true);
  };

  const handleSubmitReview = (rating: number, review: string) => {
    console.log("Review submitted:", { rating, review, stylistId: stylistToRate?.id });
    toast.success("Thank you for your review!");
    setShowRateReview(false);
    setStylistToRate(null);
  };

  const handleSkipReview = () => {
    setShowRateReview(false);
    setStylistToRate(null);
  };

  const handleAddFunds = (amount: number) => {
    setUserBalance(prev => prev + amount);
    setShowPaywall(false);
    toast.success(`Successfully added $${amount.toFixed(2)} to your wallet`);
    // After adding funds, navigate to chat
    setCurrentView("chat");
  };

  const handleClosePaywall = () => {
    setShowPaywall(false);
  };

  const renderView = () => {
    switch (currentView) {
      case "feed":
        return (
          <SocialFeed 
            onStylistClick={handleStylistClick}
            currentUserIsStylist={currentUserIsStylist}
            currentUserName={currentUserName}
            currentUserSpecialty={currentUserSpecialty}
          />
        );
      case "browse":
        return <StylistBrowse onStylistClick={handleStylistClick} />;
      case "profile":
        return selectedStylistId ? (
          <StylistProfile 
            stylistId={selectedStylistId} 
            onBack={handleBackToBrowse}
            onChat={handleChatClick}
          />
        ) : null;
      case "chat":
        return (
          <Chat 
            onBack={handleBackToBrowse} 
            onEndChat={handleEndChat}
            userBalance={userBalance}
            onShowPaywall={() => setShowPaywall(true)}
          />
        );
      case "wallet":
        return <Wallet onBack={handleBackToBrowse} />;
      case "user-profile":
        return <UserProfile onBack={handleBackToBrowse} />;
      default:
        return <StylistBrowse onStylistClick={handleStylistClick} />;
    }
  };

  return (
    <div className="size-full flex flex-col bg-background">
      <Toaster />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      <nav className="border-t bg-background/95 backdrop-blur-sm sticky bottom-0 z-20 safe-area-inset-bottom">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-around py-2 sm:py-3">
            <Button
              variant={currentView === "feed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("feed")}
              className="flex-col h-auto py-2 px-3 sm:px-4 gap-1"
            >
              <Home className="size-5" />
              <span className="text-xs">Feed</span>
            </Button>

            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("browse")}
              className="flex-col h-auto py-2 px-3 sm:px-4 gap-1"
            >
              <Search className="size-5" />
              <span className="text-xs">Browse</span>
            </Button>

            <Button
              variant={currentView === "chat" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("chat")}
              className="flex-col h-auto py-2 px-3 sm:px-4 gap-1 relative"
            >
              <MessageCircle className="size-5" />
              <span className="text-xs">Messages</span>
              {unreadMessages > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadMessages}
                </Badge>
              )}
            </Button>

            <Button
              variant={currentView === "wallet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("wallet")}
              className="flex-col h-auto py-2 px-3 sm:px-4 gap-1"
            >
              <WalletIcon className="size-5" />
              <span className="text-xs">Wallet</span>
            </Button>

            <Button
              variant={currentView === "user-profile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("user-profile")}
              className="flex-col h-auto py-2 px-3 sm:px-4 gap-1"
            >
              <User className="size-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Rate & Review Modal */}
      {showRateReview && stylistToRate && (
        <RateReview
          stylistName={stylistToRate.name}
          stylistAvatar={stylistToRate.avatar}
          onSubmit={handleSubmitReview}
          onSkip={handleSkipReview}
        />
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <Paywall
          requiredAmount={minimumChatBalance}
          currentBalance={userBalance}
          stylistName="Sophia Martinez"
          onAddFunds={handleAddFunds}
          onClose={handleClosePaywall}
        />
      )}
    </div>
  );
}