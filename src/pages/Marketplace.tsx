import { useEnergy } from "@/contexts/EnergyContext";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const Marketplace = () => {
  const { isLoggedIn, buyOrders, sellOrders, marketPrice, userRole } = useEnergy();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <DashboardLayout title="Marketplace">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Buy Orders */}
        <div className="glass-card p-6 animate-fade-up">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-blue" />
            Active Buy Orders
          </h3>
          <div className="space-y-3">
            {buyOrders.filter(b => b.remaining > 0).length === 0 && (
              <p className="text-muted-foreground text-sm py-4 text-center">No active buy orders</p>
            )}
            {buyOrders.filter(b => b.remaining > 0).map((order) => (
              <div key={order.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-foreground text-sm">{order.buyerName}</span>
                  <span className="text-neon-blue font-mono text-sm">₹{order.maxBid}/unit</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{order.remaining} units needed</span>
                  <span>{order.location.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sell Orders */}
        <div className="glass-card-green p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green" />
            Active Sell Orders
          </h3>
          <div className="space-y-3">
            {sellOrders.filter(s => s.remaining > 0).length === 0 && (
              <p className="text-muted-foreground text-sm py-4 text-center">No active sell orders</p>
            )}
            {sellOrders.filter(s => s.remaining > 0).map((order) => (
              <div key={order.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-foreground text-sm">{order.sellerName}</span>
                  <span className="text-neon-green font-mono text-sm">₹{order.minAsk}/unit</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{order.remaining} units available</span>
                  <span>{order.location.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Summary */}
      <div className="glass-card-purple p-6 mt-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Market Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold neon-text-blue font-mono">₹{marketPrice.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Market Price</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-blue font-mono">
              {buyOrders.reduce((s, b) => s + b.remaining, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Demand</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-green font-mono">
              {sellOrders.reduce((s, o) => s + o.remaining, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Supply</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
