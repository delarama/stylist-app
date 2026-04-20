import { createContext, useContext, useState } from "react";

interface WalletContextValue {
  balance: number;
  updateBalance: (newBalance: number) => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(425.00);

  return (
    <WalletContext.Provider value={{ balance, updateBalance: setBalance }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
