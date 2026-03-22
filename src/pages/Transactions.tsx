import { useEnergy } from "@/contexts/EnergyContext";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const Transactions = () => {
  const { isLoggedIn, transactions } = useEnergy();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <DashboardLayout title="Blockchain Ledger">
      <div className="space-y-4">
        {transactions.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">No transactions recorded yet</p>
          </div>
        )}
        {[...transactions].reverse().map((tx, i) => (
          <div
            key={tx.id}
            className="glass-card p-5 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
                  <span className="text-neon-purple font-mono text-sm font-bold">#{tx.blockIndex}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Block #{tx.blockIndex}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-neon-green font-mono">₹{tx.totalCost.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{tx.units} units @ ₹{tx.price}/u</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm mb-3">
              <span className="text-neon-green">{tx.sellerName}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-neon-blue">{tx.buyerName}</span>
              <span className="text-xs text-muted-foreground ml-auto">{tx.distance} km</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Hash</p>
                <p className="font-mono text-xs text-foreground/70 truncate">{tx.hash}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Prev Hash</p>
                <p className="font-mono text-xs text-foreground/70 truncate">{tx.prevHash}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
