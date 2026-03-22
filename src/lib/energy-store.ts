// Core state management for the energy grid simulator

export interface User {
  id: string;
  name: string;
  wallet: string;
  role: "buyer" | "seller";
  location: { lat: number; lng: number; city: string };
}

export interface BuyOrder {
  id: string;
  buyerId: string;
  buyerName: string;
  demand: number; // units
  maxBid: number; // ₹ per unit
  remaining: number;
  timestamp: number;
  location: { lat: number; lng: number; city: string };
}

export interface SellOrder {
  id: string;
  sellerId: string;
  sellerName: string;
  supply: number;
  minAsk: number;
  remaining: number;
  timestamp: number;
  location: { lat: number; lng: number; city: string };
}

export interface Transaction {
  id: string;
  blockIndex: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  units: number;
  price: number;
  totalCost: number;
  timestamp: number;
  hash: string;
  prevHash: string;
  distance: number;
}

export interface PricePoint {
  time: string;
  price: number;
  demand: number;
  supply: number;
}

const CITIES = [
  { city: "Mumbai", lat: 19.076, lng: 72.877 },
  { city: "Delhi", lat: 28.613, lng: 77.209 },
  { city: "Bangalore", lat: 12.971, lng: 77.594 },
  { city: "Chennai", lat: 13.082, lng: 80.270 },
  { city: "Hyderabad", lat: 17.385, lng: 78.486 },
  { city: "Pune", lat: 18.520, lng: 73.856 },
  { city: "Ahmedabad", lat: 23.022, lng: 72.571 },
  { city: "Jaipur", lat: 26.912, lng: 75.787 },
];

const BUYER_NAMES = ["Arjun Mehta", "Priya Sharma", "Vikram Rao", "Ananya Das", "Rohan Gupta", "Kavita Nair", "Siddharth Joshi", "Meera Patel"];
const SELLER_NAMES = ["SolarGrid Alpha", "GreenWatt Co.", "SunPower Hub", "EcoVolt Systems", "BrightEnergy Ltd.", "PhotonFarm", "SolarNest", "CleanJoule Inc."];

function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function randomWallet(): string {
  return "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

function fakeHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }
  return "0x" + Math.abs(hash).toString(16).padStart(16, "0");
}

function getDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function generateInitialBuyOrders(): BuyOrder[] {
  return BUYER_NAMES.slice(0, 5).map((name, i) => {
    const loc = CITIES[i % CITIES.length];
    const demand = Math.floor(Math.random() * 40 + 10);
    const bid = Math.floor(Math.random() * 4 + 5);
    return {
      id: randomId(),
      buyerId: randomId(),
      buyerName: name,
      demand,
      maxBid: bid,
      remaining: demand,
      timestamp: Date.now() - Math.floor(Math.random() * 3600000),
      location: loc,
    };
  });
}

function generateInitialSellOrders(): SellOrder[] {
  return SELLER_NAMES.slice(0, 5).map((name, i) => {
    const loc = CITIES[(i + 3) % CITIES.length];
    const supply = Math.floor(Math.random() * 50 + 15);
    const ask = Math.floor(Math.random() * 3 + 3);
    return {
      id: randomId(),
      sellerId: randomId(),
      sellerName: name,
      supply,
      minAsk: ask,
      remaining: supply,
      timestamp: Date.now() - Math.floor(Math.random() * 3600000),
      location: loc,
    };
  });
}

// Greedy matching algorithm
export function runMatching(
  buyOrders: BuyOrder[],
  sellOrders: SellOrder[]
): { transactions: Transaction[]; updatedBuyers: BuyOrder[]; updatedSellers: SellOrder[] } {
  const buyers = buyOrders.map((b) => ({ ...b })).filter((b) => b.remaining > 0);
  const sellers = sellOrders.map((s) => ({ ...s })).filter((s) => s.remaining > 0);

  buyers.sort((a, b) => b.maxBid - a.maxBid);
  sellers.sort((a, b) => a.minAsk - b.minAsk);

  const transactions: Transaction[] = [];
  let prevHash = "0x0000000000000000";
  let blockIndex = 1;

  for (const buyer of buyers) {
    for (const seller of sellers) {
      if (buyer.remaining <= 0) break;
      if (seller.remaining <= 0) continue;
      if (buyer.maxBid >= seller.minAsk) {
        const units = Math.min(buyer.remaining, seller.remaining);
        const price = Math.round(((buyer.maxBid + seller.minAsk) / 2) * 100) / 100;
        const distance = Math.round(getDistance(buyer.location, seller.location));
        const data = `${buyer.buyerId}${seller.sellerId}${units}${price}${Date.now()}`;
        const hash = fakeHash(data);

        transactions.push({
          id: randomId(),
          blockIndex,
          buyerId: buyer.buyerId,
          buyerName: buyer.buyerName,
          sellerId: seller.sellerId,
          sellerName: seller.sellerName,
          units,
          price,
          totalCost: Math.round(units * price * 100) / 100,
          timestamp: Date.now(),
          hash,
          prevHash,
          distance,
        });

        buyer.remaining -= units;
        seller.remaining -= units;
        prevHash = hash;
        blockIndex++;
      }
    }
  }

  return { transactions, updatedBuyers: buyers, updatedSellers: sellers };
}

// Dynamic pricing
export function calculateMarketPrice(totalDemand: number, totalSupply: number): number {
  const basePrice = 5;
  if (totalSupply === 0) return basePrice * 2;
  const ratio = totalDemand / totalSupply;
  return Math.round(basePrice * Math.pow(ratio, 0.5) * 100) / 100;
}

export function createStore() {
  let buyOrders = generateInitialBuyOrders();
  let sellOrders = generateInitialSellOrders();
  let transactions: Transaction[] = [];
  let priceHistory: PricePoint[] = [];

  // Generate initial price history
  for (let i = 12; i >= 0; i--) {
    const d = new Date(Date.now() - i * 300000);
    const demand = Math.floor(Math.random() * 100 + 80);
    const supply = Math.floor(Math.random() * 100 + 60);
    priceHistory.push({
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price: calculateMarketPrice(demand, supply),
      demand,
      supply,
    });
  }

  // Run initial matching
  const initial = runMatching(buyOrders, sellOrders);
  transactions = initial.transactions;
  buyOrders = buyOrders.map((b) => {
    const updated = initial.updatedBuyers.find((u) => u.id === b.id);
    return updated || b;
  });
  sellOrders = sellOrders.map((s) => {
    const updated = initial.updatedSellers.find((u) => u.id === s.id);
    return updated || s;
  });

  return {
    buyOrders,
    sellOrders,
    transactions,
    priceHistory,
    getMarketPrice() {
      const totalDemand = buyOrders.reduce((s, b) => s + b.remaining, 0);
      const totalSupply = sellOrders.reduce((s, o) => s + o.remaining, 0);
      return calculateMarketPrice(totalDemand, totalSupply);
    },
    getTotalDemand() {
      return buyOrders.reduce((s, b) => s + b.remaining, 0);
    },
    getTotalSupply() {
      return sellOrders.reduce((s, o) => s + o.remaining, 0);
    },
    addBuyOrder(demand: number, maxBid: number, userName: string) {
      const loc = CITIES[Math.floor(Math.random() * CITIES.length)];
      const order: BuyOrder = {
        id: randomId(),
        buyerId: randomId(),
        buyerName: userName,
        demand,
        maxBid,
        remaining: demand,
        timestamp: Date.now(),
        location: loc,
      };
      buyOrders = [...buyOrders, order];

      const result = runMatching([order], sellOrders);
      transactions = [...transactions, ...result.transactions];
      sellOrders = sellOrders.map((s) => {
        const updated = result.updatedSellers.find((u) => u.id === s.id);
        return updated || s;
      });
      buyOrders = buyOrders.map((b) => {
        if (b.id === order.id) {
          const updated = result.updatedBuyers.find((u) => u.id === order.id);
          return updated || b;
        }
        return b;
      });

      this.updatePriceHistory();
      return { order, newTransactions: result.transactions };
    },
    addSellOrder(supply: number, minAsk: number, userName: string) {
      const loc = CITIES[Math.floor(Math.random() * CITIES.length)];
      const order: SellOrder = {
        id: randomId(),
        sellerId: randomId(),
        sellerName: userName,
        supply,
        minAsk,
        remaining: supply,
        timestamp: Date.now(),
        location: loc,
      };
      sellOrders = [...sellOrders, order];

      const result = runMatching(buyOrders, [order]);
      transactions = [...transactions, ...result.transactions];
      buyOrders = buyOrders.map((b) => {
        const updated = result.updatedBuyers.find((u) => u.id === b.id);
        return updated || b;
      });
      sellOrders = sellOrders.map((s) => {
        if (s.id === order.id) {
          const updated = result.updatedSellers.find((u) => u.id === order.id);
          return updated || s;
        }
        return s;
      });

      this.updatePriceHistory();
      return { order, newTransactions: result.transactions };
    },
    updatePriceHistory() {
      const totalDemand = buyOrders.reduce((s, b) => s + b.remaining, 0);
      const totalSupply = sellOrders.reduce((s, o) => s + o.remaining, 0);
      const now = new Date();
      priceHistory = [
        ...priceHistory,
        {
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          price: calculateMarketPrice(totalDemand, totalSupply),
          demand: totalDemand,
          supply: totalSupply,
        },
      ];
    },
    getSnapshot() {
      return { buyOrders, sellOrders, transactions, priceHistory };
    },
  };
}

export type EnergyStore = ReturnType<typeof createStore>;
