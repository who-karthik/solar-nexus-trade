import { useEnergy } from "@/contexts/EnergyContext";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const Visualization = () => {
  const { isLoggedIn, transactions, priceHistory, totalDemand, totalSupply } = useEnergy();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  // Energy flow data
  const flowData = transactions.slice(-8).map((tx) => ({
    name: `${tx.sellerName.split(" ")[0]} → ${tx.buyerName.split(" ")[0]}`,
    units: tx.units,
    price: tx.price,
  }));

  return (
    <DashboardLayout title="Visualization">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Price Chart */}
        <div className="glass-card p-6 animate-fade-up">
          <h3 className="text-lg font-semibold text-foreground mb-4">Market Price Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 40%, 10%)",
                    border: "1px solid hsl(222, 30%, 22%)",
                    borderRadius: "8px",
                    color: "hsl(210, 40%, 92%)",
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="price" stroke="hsl(199, 89%, 48%)" fill="url(#priceGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supply vs Demand */}
        <div className="glass-card p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Supply vs Demand</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 40%, 10%)",
                    border: "1px solid hsl(222, 30%, 22%)",
                    borderRadius: "8px",
                    color: "hsl(210, 40%, 92%)",
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="demand" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="supply" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-3 justify-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-0.5 bg-neon-blue rounded" /> Demand
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-0.5 bg-neon-green rounded" /> Supply
            </div>
          </div>
        </div>

        {/* Energy Flow */}
        <div className="glass-card-purple p-6 lg:col-span-2 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-6">Energy Flow (Recent Trades)</h3>
          {flowData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No trades yet</p>
          ) : (
            <div className="space-y-3">
              {flowData.map((flow, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <span className="text-sm font-medium text-foreground min-w-[200px]">{flow.name}</span>
                  <div className="flex-1 h-6 relative rounded-full overflow-hidden bg-muted/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon-green/60 to-neon-blue/60 relative"
                      style={{ width: `${Math.min((flow.units / 50) * 100, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-green/40 to-neon-blue/40 animate-flow-right" />
                    </div>
                  </div>
                  <span className="font-mono text-sm text-foreground min-w-[70px] text-right">
                    {flow.units} units
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Visualization;
