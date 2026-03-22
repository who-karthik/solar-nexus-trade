import { useState } from "react";
import { useEnergy } from "@/contexts/EnergyContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowLeft, Loader2 } from "lucide-react";

const Login = () => {
  const { userRole, login } = useEnergy();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [connecting, setConnecting] = useState(false);

  if (!userRole) {
    navigate("/");
    return null;
  }

  const handleConnect = () => {
    if (!name.trim()) return;
    setConnecting(true);
    setTimeout(() => {
      login(name.trim());
      navigate("/dashboard");
    }, 1500);
  };

  const isBuyer = userRole === "buyer";
  const accentClass = isBuyer ? "neon-text-blue" : "neon-text-green";
  const cardClass = isBuyer ? "glass-card" : "glass-card-green";
  const btnVariant = isBuyer ? "neonBlue" : "neonGreen";

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-fade-up">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className={cardClass + " p-8"}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-4">
              <Wallet className={`w-8 h-8 ${isBuyer ? "text-neon-blue" : "text-neon-green"}`} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Connect Wallet</h2>
            <p className="text-muted-foreground text-sm">
              Sign in as <span className={accentClass}>{isBuyer ? "Buyer" : "Seller"}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isBuyer ? "e.g. Arjun Mehta" : "e.g. SolarGrid Alpha"}
                className="w-full h-11 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              />
            </div>

            <Button
              variant={btnVariant as any}
              size="lg"
              className="w-full"
              onClick={handleConnect}
              disabled={!name.trim() || connecting}
            >
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect MetaMask
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
              Ethereum Mainnet • Simulated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
