import { X, DollarSign, CreditCard, Wallet as WalletIcon, ChevronRight, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface PaywallProps {
  requiredAmount: number;
  currentBalance: number;
  stylistName: string;
  onAddFunds: (amount: number) => void;
  onClose: () => void;
}

export function Paywall({ requiredAmount, currentBalance, stylistName, onAddFunds, onClose }: PaywallProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const suggestedAmounts = [50, 100, 200, 500];
  const shortfall = requiredAmount - currentBalance;

  const handleAddFunds = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (amount && amount >= shortfall) {
      onAddFunds(amount);
    }
  };

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <Card className="w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl rounded-b-none sm:rounded-b-2xl border-0 sm:border max-h-[90vh] overflow-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl mb-2">Add Funds to Chat</h2>
              <p className="text-sm text-muted-foreground">
                Add funds to start messaging with {stylistName}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {/* Balance Info */}
          <div className="mb-6">
            <Card className="p-4 bg-muted/50 border-border/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Current Balance</span>
                <span className="text-lg">${currentBalance.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Required Amount</span>
                <span className="text-lg">${requiredAmount.toFixed(2)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="text-sm">Minimum to Add</span>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  ${shortfall.toFixed(2)}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Quick Select Amounts */}
          <div className="mb-6">
            <Label className="mb-3 block">Select Amount</Label>
            <div className="grid grid-cols-2 gap-3">
              {suggestedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAmount === amount
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-1">${amount}</div>
                  {amount >= shortfall && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <Label htmlFor="custom" className="mb-2 block">
              Or Enter Custom Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                id="custom"
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="pl-12 h-14 text-lg"
                min={shortfall}
              />
            </div>
            {customAmount && parseFloat(customAmount) < shortfall && (
              <p className="text-xs text-destructive mt-2">
                Amount must be at least ${shortfall.toFixed(2)}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <Label className="mb-3 block">Payment Method</Label>
            <button className="w-full p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                  <CreditCard className="size-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm mb-0.5">•••• •••• •••• 4242</div>
                  <div className="text-xs text-muted-foreground">Expires 12/26</div>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>
          </div>

          {/* Summary */}
          {finalAmount > 0 && (
            <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Amount to Add</span>
                <span className="text-lg">${finalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Balance</span>
                <span className="text-lg text-primary">
                  ${(currentBalance + finalAmount).toFixed(2)}
                </span>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleAddFunds}
              disabled={!finalAmount || finalAmount < shortfall}
              className="w-full h-12 sm:h-13 text-base"
              size="lg"
            >
              <WalletIcon className="size-5 mr-2" />
              Add ${(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)}
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3" />
              <span>Secure payment processing</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
