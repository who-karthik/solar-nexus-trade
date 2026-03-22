import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { createStore, type EnergyStore, type BuyOrder, type SellOrder, type Transaction, type PricePoint } from "@/lib/energy-store";

interface EnergyState {
  buyOrders: BuyOrder[];
  sellOrders: SellOrder[];
  transactions: Transaction[];
  priceHistory: PricePoint[];
  marketPrice: number;
  totalDemand: number;
  totalSupply: number;
  userRole: "buyer" | "seller" | null;
  userName: string;
  walletAddress: string;
  isLoggedIn: boolean;
  alerts: string[];
  setRole: (role: "buyer" | "seller") => void;
  login: (name: string) => void;
  logout: () => void;
  placeBuyOrder: (demand: number, maxBid: number) => Transaction[];
  placeSellOrder: (supply: number, minAsk: number) => Transaction[];
}

const EnergyContext = createContext<EnergyState | null>(null);

export function EnergyProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<EnergyStore>(createStore());
  const [snapshot, setSnapshot] = useState(storeRef.current.getSnapshot());
  const [userRole, setUserRole] = useState<"buyer" | "seller" | null>(null);
  const [userName, setUserName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setSnapshot(storeRef.current.getSnapshot());
  }, []);

  const setRole = useCallback((role: "buyer" | "seller") => {
    setUserRole(role);
  }, []);

  const login = useCallback((name: string) => {
    setUserName(name);
    setWalletAddress("0x" + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserName("");
    setWalletAddress("");
    setUserRole(null);
  }, []);

  const placeBuyOrder = useCallback((demand: number, maxBid: number) => {
    const store = storeRef.current;
    const result = store.addBuyOrder(demand, maxBid, userName || "You");
    refresh();

    const newAlerts: string[] = [];
    if (store.getMarketPrice() < maxBid * 0.8) {
      newAlerts.push("🔔 Low price available – buy now!");
    }
    if (result.newTransactions.length > 0) {
      newAlerts.push(`⚡ ${result.newTransactions.length} trade(s) matched!`);
    }
    setAlerts((prev) => [...newAlerts, ...prev].slice(0, 5));
    return result.newTransactions;
  }, [userName, refresh]);

  const placeSellOrder = useCallback((supply: number, minAsk: number) => {
    const store = storeRef.current;
    const result = store.addSellOrder(supply, minAsk, userName || "You");
    refresh();

    const newAlerts: string[] = [];
    if (store.getMarketPrice() > minAsk * 1.2) {
      newAlerts.push("🔔 High demand – sell now!");
    }
    if (result.newTransactions.length > 0) {
      newAlerts.push(`⚡ ${result.newTransactions.length} trade(s) matched!`);
    }
    setAlerts((prev) => [...newAlerts, ...prev].slice(0, 5));
    return result.newTransactions;
  }, [userName, refresh]);

  const store = storeRef.current;
  const value: EnergyState = {
    ...snapshot,
    marketPrice: store.getMarketPrice(),
    totalDemand: store.getTotalDemand(),
    totalSupply: store.getTotalSupply(),
    userRole,
    userName,
    walletAddress,
    isLoggedIn,
    alerts,
    setRole,
    login,
    logout,
    placeBuyOrder,
    placeSellOrder,
  };

  return <EnergyContext.Provider value={value}>{children}</EnergyContext.Provider>;
}

export function useEnergy() {
  const ctx = useContext(EnergyContext);
  if (!ctx) throw new Error("useEnergy must be used within EnergyProvider");
  return ctx;
}
