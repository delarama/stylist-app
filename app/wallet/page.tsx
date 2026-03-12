"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Download,
  CreditCard,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { PageShell } from "@/app/components/PageShell";

const AMOUNT_OPTIONS = [10, 25, 50] as const;
type TopUpAmount = (typeof AMOUNT_OPTIONS)[number];

type HistoryEntry = {
  id: string;
  type: "deposit" | "chat_payment" | "refund";
  amount: number;
  created_at: string;
  description: string;
};

function WalletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minutesBalance, setMinutesBalance] = useState<number | null>(null);
  const [dollarBalance, setDollarBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<TopUpAmount>(25);
  const [checkingOut, setCheckingOut] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/wallet/history", { credentials: "include", cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.ok) setHistory(data.entries);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/wallet", {
        credentials: "include",
        cache: "no-store",
      });

      if (res.status === 401) {
        setMinutesBalance(0);
        setDollarBalance(0);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Failed to parse JSON response");
      }

      if (!data.ok) {
        if (data.error === "NOT_SIGNED_IN") {
          setMinutesBalance(0);
          setDollarBalance(0);
          return;
        }
        setError(data.error || "Failed to load wallet balance");
        return;
      }

      setMinutesBalance(data.minutes_balance ?? 0);
      setDollarBalance(data.balance ?? 0);
    } catch (err) {
      console.error("Error fetching wallet:", err);
      setError("Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isSuccess = searchParams.get("deposit_success") === "1";
    if (isSuccess) {
      setDepositSuccess(true);
      window.dispatchEvent(new CustomEvent("refetch-wallet"));
    }

    fetchWallet();
    fetchHistory();

    const handleRefetch = () => { fetchWallet(); fetchHistory(); };
    window.addEventListener("refetch-wallet", handleRefetch);
    return () => window.removeEventListener("refetch-wallet", handleRefetch);
  }, []);

  const handleAddFunds = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/wallet/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: topUpAmount }),
      });
      const data = await res.json();
      if (!data.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      router.push(data.url);
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message ?? "Failed to start checkout");
      setCheckingOut(false);
    }
  };

  const handleUseTime = () => {
    router.push("/");
  };

  return (
    <PageShell
      header={{
        left: (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="-ml-2"
          >
            <ArrowLeft className="size-4" />
          </Button>
        ),
        center: <h1 className="text-2xl">Wallet</h1>,
        right: (
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
        ),
      }}
      className="py-8"
    >
      {/* Deposit success banner */}
      {depositSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          <CheckCircle className="size-5 shrink-0 text-green-600" />
          <span className="text-sm font-medium">
            Your deposit of ${topUpAmount} was successful! Your balance has been updated.
          </span>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Balance */}
        <Card className="w-full p-6 lg:col-span-2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <p className="text-primary-foreground/80 mb-2">Available Balance</p>
              <h2 className="text-4xl">
                {loading ? (
                  <span className="text-primary-foreground/60">Loading...</span>
                ) : error ? (
                  <span className="text-primary-foreground/60">—</span>
                ) : (
                  `$${(dollarBalance ?? 0).toFixed(2)}`
                )}
              </h2>
              {error && (
                <p className="mt-2 text-sm text-primary-foreground/70">{error}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center shrink-0 ml-4">
              <Clock className="size-6" />
            </div>
          </div>

          {/* Amount selector */}
          <div className="flex gap-2 mb-3">
            {AMOUNT_OPTIONS.map((amt) => (
              <button
                key={amt}
                onClick={() => setTopUpAmount(amt)}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                  topUpAmount === amt
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              disabled={minutesBalance === null || minutesBalance <= 0 || loading || !!error}
              onClick={handleUseTime}
            >
              <Plus className="size-4 mr-2" />
              Use Time
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              disabled={checkingOut || loading}
              onClick={handleAddFunds}
            >
              <CreditCard className="size-4 mr-2" />
              {checkingOut ? "Redirecting..." : `Add $${topUpAmount}`}
            </Button>
          </div>
        </Card>

        {/* Stats */}
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

          {(
            [
              { value: "all", entries: history },
              { value: "payments", entries: history.filter((e) => e.type === "chat_payment") },
              { value: "deposits", entries: history.filter((e) => e.type === "deposit") },
              { value: "refunds", entries: history.filter((e) => e.type === "refund") },
            ] as const
          ).map(({ value, entries }) => (
            <TabsContent key={value} value={value} className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6 pt-4 space-y-3">
                  {historyLoading ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No transactions yet</p>
                    </div>
                  ) : (
                    entries.map((entry) => {
                      const isDeposit = entry.type === "deposit";
                      const isRefund = entry.type === "refund";
                      return (
                        <div
                          key={entry.id}
                          className="flex items-center gap-4 rounded-lg border p-4"
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              isDeposit || isRefund
                                ? "bg-green-500/10"
                                : "bg-red-500/10"
                            }`}
                          >
                            {isDeposit || isRefund ? (
                              <ArrowDownLeft className="size-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className="size-5 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{entry.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <p
                            className={`text-sm font-medium tabular-nums ${
                              isDeposit || isRefund ? "text-green-600" : "text-red-500"
                            }`}
                          >
                            {isDeposit || isRefund ? "+" : "-"}${entry.amount.toFixed(2)}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </PageShell>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <WalletContent />
    </Suspense>
  );
}
