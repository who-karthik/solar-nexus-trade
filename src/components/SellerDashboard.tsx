import { useState } from "react";
import { useEnergy } from "@/contexts/EnergyContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Sun, TrendingUp, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SellerDashboard = () => {
  const { marketPrice, totalDemand, totalSupply, buyOrders, transactions, priceHistory, placeSellOrder, userName } = useEnergy();
  const [supply, setSupply] = useState("");
  const [minAsk, setMinAsk] = useState("");
  const [lastTrades, setLastTrades] = useState<any[]>([]);

  const handleSell = () => {
    const s = parseInt(supply);
    const a = parseFloat(minAsk);
    if (!s || !a || s <= 0 || a <= 0) return;
    const trades = placeSellOrder(s, a);
    setLastTrades(trades);
    setSupply("");
    setMinAsk("");
  };

  const myTransactions = transactions.filter((t) => t.sellerName === userName);
  const earnings = myTransactions.reduce((s, t) => s + t.totalCost, 0);
  const activeBuyers = buyOrders.filter((b) => b.remaining > 0).sort((a, b) => b.maxBid - a.maxBid);

  return (
    <DashboardLayout title="Seller Dashboard">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Market Price", value: `₹${marketPrice.toFixed(2)}`, sub: "per unit", color: "neon-text-green" },
            { label: "Total Demand", value: `${totalDemand}`, sub: "units", color: "text-neon-blue" },
            { label: "Earnings", value: `₹${earnings.toFixed(0)}`, sub: "total", color: "text-neon-green" },
            { label: "My Sales", value: `${myTransactions.length}`, sub: "completed", color: "text-neon-purple" },
          ].map((stat, i) => (
            <div key={i} className="glass-card-green p-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Sell Form */}
        <div className="glass-card-green p-6 animate-fade-up" style={{ animationDelay: "250ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-neon-green" /> Place Sell Order
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Energy Available (units)</label>
              <input
                type="number"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                placeholder="e.g. 30"
                className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Min Ask Price (₹/unit)</label>
              <input
                type="number"
                value={minAsk}
                onChange={(e) => setMinAsk(e.target.value)}
                placeholder="e.g. 4"
                className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
              />
            </div>
            <Button variant="neonGreen" className="w-full" onClick={handleSell} disabled={!supply || !minAsk}>
              <Sun className="w-4 h-4" /> Sell Energy
            </Button>
            {lastTrades.length > 0 && (
              <p className="text-xs text-neon-green">✓ {lastTrades.length} trade(s) matched!</p>
            )}
          </div>
        </div>

        {/* Price Chart */}
        <div className="glass-card-green p-6 lg:col-span-2 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Price Trend</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="sellPriceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 40%, 10%)", border: "1px solid hsl(222, 30%, 22%)", borderRadius: "8px", color: "hsl(210, 40%, 92%)", fontSize: 12 }} />
                <Area type="monotone" dataKey="price" stroke="hsl(142, 71%, 45%)" fill="url(#sellPriceGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Buyers */}
        <div className="glass-card p-6 lg:col-span-2 animate-fade-up" style={{ animationDelay: "350ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon-blue" /> Active Buyer Bids
          </h3>
          <div className="space-y-2">
            {activeBuyers.length === 0 && <p className="text-muted-foreground text-sm py-4 text-center">No active buyers</p>}
            {activeBuyers.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.buyerName}</p>
                  <p className="text-xs text-muted-foreground">{b.location.city} • {b.remaining} units</p>
                </div>
                <span className="text-neon-blue font-mono font-bold text-sm">₹{b.maxBid}/u</span>
              </div>
            ))}
          </div>
        </div>

        {/* My Sales */}
        <div className="glass-card-purple p-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-neon-purple" /> My Sales
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {myTransactions.length === 0 && <p className="text-muted-foreground text-sm py-4 text-center">No sales yet</p>}
            {myTransactions.slice(-5).reverse().map((tx) => (
              <div key={tx.id} className="p-3 rounded-lg bg-muted/30 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-foreground">{tx.buyerName}</span>
                  <span className="text-neon-green font-mono">+₹{tx.totalCost.toFixed(2)}</span>
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

export default SellerDashboard;
