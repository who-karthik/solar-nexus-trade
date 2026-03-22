import { useState } from "react";
import { useEnergy } from "@/contexts/EnergyContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Zap, TrendingDown, ShoppingCart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BuyerDashboard = () => {
  const { marketPrice, totalDemand, totalSupply, sellOrders, transactions, priceHistory, placeBuyOrder, userName } = useEnergy();
  const [demand, setDemand] = useState("");
  const [maxBid, setMaxBid] = useState("");
  const [lastTrades, setLastTrades] = useState<any[]>([]);

  const handleBuy = () => {
    const d = parseInt(demand);
    const b = parseFloat(maxBid);
    if (!d || !b || d <= 0 || b <= 0) return;
    const trades = placeBuyOrder(d, b);
    setLastTrades(trades);
    setDemand("");
    setMaxBid("");
  };

  const myTransactions = transactions.filter((t) => t.buyerName === userName);
  const availableSellers = sellOrders.filter((s) => s.remaining > 0).sort((a, b) => a.minAsk - b.minAsk);

  return (
    <DashboardLayout title="Buyer Dashboard">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Market Price", value: `₹${marketPrice.toFixed(2)}`, sub: "per unit", color: "neon-text-blue" },
            { label: "Total Demand", value: `${totalDemand}`, sub: "units", color: "text-neon-blue" },
            { label: "Total Supply", value: `${totalSupply}`, sub: "units", color: "text-neon-green" },
            { label: "My Trades", value: `${myTransactions.length}`, sub: "completed", color: "text-neon-purple" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Buy Form */}
        <div className="glass-card p-6 animate-fade-up" style={{ animationDelay: "250ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-neon-blue" /> Place Buy Order
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Energy Needed (units)</label>
              <input
                type="number"
                value={demand}
                onChange={(e) => setDemand(e.target.value)}
                placeholder="e.g. 25"
                className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Max Bid Price (₹/unit)</label>
              <input
                type="number"
                value={maxBid}
                onChange={(e) => setMaxBid(e.target.value)}
                placeholder="e.g. 7"
                className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
              />
            </div>
            <Button variant="neonBlue" className="w-full" onClick={handleBuy} disabled={!demand || !maxBid}>
              <Zap className="w-4 h-4" /> Buy Energy
            </Button>
            {lastTrades.length > 0 && (
              <p className="text-xs text-neon-green">✓ {lastTrades.length} trade(s) matched!</p>
            )}
          </div>
        </div>

        {/* Price Chart */}
        <div className="glass-card p-6 lg:col-span-2 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Price Trend</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="buyPriceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 40%, 10%)", border: "1px solid hsl(222, 30%, 22%)", borderRadius: "8px", color: "hsl(210, 40%, 92%)", fontSize: 12 }} />
                <Area type="monotone" dataKey="price" stroke="hsl(199, 89%, 48%)" fill="url(#buyPriceGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Available Sellers */}
        <div className="glass-card-green p-6 lg:col-span-2 animate-fade-up" style={{ animationDelay: "350ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-neon-green" /> Best Offers
          </h3>
          <div className="space-y-2">
            {availableSellers.length === 0 && <p className="text-muted-foreground text-sm py-4 text-center">No sellers available</p>}
            {availableSellers.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.sellerName}</p>
                  <p className="text-xs text-muted-foreground">{s.location.city} • {s.remaining} units</p>
                </div>
                <span className="text-neon-green font-mono font-bold text-sm">₹{s.minAsk}/u</span>
              </div>
            ))}
          </div>
        </div>

        {/* My Transaction History */}
        <div className="glass-card-purple p-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">My Transactions</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {myTransactions.length === 0 && <p className="text-muted-foreground text-sm py-4 text-center">No transactions yet</p>}
            {myTransactions.slice(-5).reverse().map((tx) => (
              <div key={tx.id} className="p-3 rounded-lg bg-muted/30 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-foreground">{tx.sellerName}</span>
                  <span className="text-neon-green font-mono">₹{tx.totalCost.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{tx.units} units @ ₹{tx.price}/u</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
