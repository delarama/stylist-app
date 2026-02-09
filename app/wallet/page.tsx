"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Download,
  CreditCard,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";

export default function WalletPage() {
  const router = useRouter();
  const [minutesBalance, setMinutesBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/wallet", {
        credentials: "include",
        cache: "no-store",
      });

      // Handle 401 as signed-out state (no error, just no balance)
      if (res.status === 401) {
        setMinutesBalance(0);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.log("Response status:", res.status);
        console.log("Content-Type:", res.headers.get("content-type"));
        throw new Error("Failed to parse JSON response");
      }

      if (!data.ok) {
        // Don't show error for NOT_SIGNED_IN (should be handled by 401 check above, but just in case)
        if (data.error === "NOT_SIGNED_IN") {
          setMinutesBalance(0);
          return;
        }
        setError(data.error || "Failed to load wallet balance");
        return;
      }

      setMinutesBalance(data.minutes_balance ?? 0);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      setError("Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();

    // Listen for wallet refetch events
    const handleRefetch = () => {
      fetchWallet();
    };

    window.addEventListener("refetch-wallet", handleRefetch);

    return () => {
      window.removeEventListener("refetch-wallet", handleRefetch);
    };
  }, []);

  const handleUseTime = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      {/* Header - matches Figma */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:max-w-5xl lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="-ml-2"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <h1 className="text-2xl">Wallet</h1>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:max-w-5xl lg:px-8 py-8">
        {/* Balance Cards - Mobile-first: single column on mobile, grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Balance */}
          <Card className="w-full p-6 md:col-span-2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <p className="text-primary-foreground/80 mb-2">Available Minutes</p>
                <h2 className="text-4xl">
                  {loading ? (
                    <span className="text-primary-foreground/60">Loading...</span>
                  ) : error ? (
                    <span className="text-primary-foreground/60">—</span>
                  ) : (
                    minutesBalance
                  )}
                </h2>
                {error && (
                  <p className="mt-2 text-sm text-primary-foreground/70">
                    {error}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center shrink-0 ml-4">
                <Clock className="size-6" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                disabled={
                  minutesBalance === null ||
                  minutesBalance <= 0 ||
                  loading ||
                  !!error
                }
                onClick={handleUseTime}
              >
                <Plus className="size-4 mr-2" />
                Use Time
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <CreditCard className="size-4 mr-2" />
                Add Funds
              </Button>
            </div>
          </Card>

          {/* Stats - Stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col gap-4 w-full">
            <Card className="w-full p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl">0 min</p>
                </div>
              </div>
            </Card>

            <Card className="w-full p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Used</p>
                  <p className="text-xl">0 min</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Transactions */}
        <Card className="overflow-hidden">
          <Tabs defaultValue="all" className="w-full">
            <div className="p-6 pb-0">
              <h3 className="mb-4">Transaction History</h3>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6 pt-4">
                  <div className="space-y-4">
                    {/* Empty state */}
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No transactions yet
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="payments" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6 pt-4">
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No transactions yet
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="deposits" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6 pt-4">
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No transactions yet
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="refunds" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6 pt-4">
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No transactions yet
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
