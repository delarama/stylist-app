import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Plus, Download, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface Transaction {
  id: number;
  type: "payment" | "refund" | "deposit";
  description: string;
  stylist?: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

const transactions: Transaction[] = [
  {
    id: 1,
    type: "payment",
    description: "Balayage Service",
    stylist: "Sophia Martinez",
    amount: -250.00,
    date: "Feb 3, 2026",
    status: "completed"
  },
  {
    id: 2,
    type: "deposit",
    description: "Added Funds",
    amount: 500.00,
    date: "Feb 1, 2026",
    status: "completed"
  },
  {
    id: 3,
    type: "payment",
    description: "Fashion Consultation",
    stylist: "Isabella Chen",
    amount: -175.00,
    date: "Jan 28, 2026",
    status: "completed"
  },
  {
    id: 4,
    type: "payment",
    description: "Bridal Makeup",
    stylist: "Emma Johnson",
    amount: -300.00,
    date: "Jan 25, 2026",
    status: "completed"
  },
  {
    id: 5,
    type: "refund",
    description: "Cancelled Appointment",
    stylist: "Olivia Williams",
    amount: 150.00,
    date: "Jan 22, 2026",
    status: "completed"
  },
  {
    id: 6,
    type: "payment",
    description: "Haircut & Style",
    stylist: "Ava Rodriguez",
    amount: -85.00,
    date: "Jan 18, 2026",
    status: "completed"
  },
  {
    id: 7,
    type: "deposit",
    description: "Added Funds",
    amount: 300.00,
    date: "Jan 15, 2026",
    status: "completed"
  },
  {
    id: 8,
    type: "payment",
    description: "Color Treatment",
    stylist: "Sophia Martinez",
    amount: -200.00,
    date: "Jan 12, 2026",
    status: "completed"
  }
];

interface WalletProps {
  onBack: () => void;
}

export function Wallet({ onBack }: WalletProps) {
  const balance = 425.00;
  const totalSpent = transactions
    .filter(t => t.type === "payment")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const thisMonthSpent = transactions
    .filter(t => t.type === "payment" && t.date.includes("Feb"))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Balance */}
          <Card className="p-6 md:col-span-2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-primary-foreground/80 mb-2">Available Balance</p>
                <h2 className="text-4xl">${balance.toFixed(2)}</h2>
              </div>
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <DollarSign className="size-6" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Plus className="size-4 mr-2" />
                Add Funds
              </Button>
              <Button variant="outline" className="flex-1 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <CreditCard className="size-4 mr-2" />
                Cards
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl">${thisMonthSpent.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl">${totalSpent.toFixed(2)}</p>
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
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'payment' 
                              ? 'bg-red-500/10' 
                              : transaction.type === 'deposit'
                              ? 'bg-green-500/10'
                              : 'bg-blue-500/10'
                          }`}>
                            {transaction.type === 'payment' ? (
                              <ArrowUpRight className={`size-5 text-red-600`} />
                            ) : transaction.type === 'deposit' ? (
                              <ArrowDownLeft className={`size-5 text-green-600`} />
                            ) : (
                              <ArrowDownLeft className={`size-5 text-blue-600`} />
                            )}
                          </div>
                          <div>
                            <h4 className="mb-1">{transaction.description}</h4>
                            <div className="flex items-center gap-2">
                              {transaction.stylist && (
                                <p className="text-sm text-muted-foreground">{transaction.stylist}</p>
                              )}
                              <span className="text-sm text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">{transaction.date}</p>
                              <Badge 
                                variant={transaction.status === 'completed' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg ${
                          transaction.amount > 0 ? 'text-green-600' : ''
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="payments" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6 pt-4">
                  <div className="space-y-4">
                    {transactions
                      .filter(t => t.type === 'payment')
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10">
                              <ArrowUpRight className="size-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="mb-1">{transaction.description}</h4>
                              <div className="flex items-center gap-2">
                                {transaction.stylist && (
                                  <p className="text-sm text-muted-foreground">{transaction.stylist}</p>
                                )}
                                <span className="text-sm text-muted-foreground">•</span>
                                <p className="text-sm text-muted-foreground">{transaction.date}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-lg">
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="deposits" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6 pt-4">
                  <div className="space-y-4">
                    {transactions
                      .filter(t => t.type === 'deposit')
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/10">
                              <ArrowDownLeft className="size-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="mb-1">{transaction.description}</h4>
                              <p className="text-sm text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                          <div className="text-lg text-green-600">
                            +${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="refunds" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6 pt-4">
                  <div className="space-y-4">
                    {transactions
                      .filter(t => t.type === 'refund')
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10">
                              <ArrowDownLeft className="size-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="mb-1">{transaction.description}</h4>
                              <div className="flex items-center gap-2">
                                {transaction.stylist && (
                                  <p className="text-sm text-muted-foreground">{transaction.stylist}</p>
                                )}
                                <span className="text-sm text-muted-foreground">•</span>
                                <p className="text-sm text-muted-foreground">{transaction.date}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-lg text-green-600">
                            +${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </div>
                      ))}
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
