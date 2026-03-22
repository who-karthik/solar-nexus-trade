import { useEnergy } from "@/contexts/EnergyContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Sun } from "lucide-react";
import { useEffect } from "react";

const RoleSelection = () => {
  const { setRole, isLoggedIn } = useEnergy();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard");
  }, [isLoggedIn, navigate]);

  const handleRole = (role: "buyer" | "seller") => {
    setRole(role);
    navigate("/login");
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border mb-6 text-sm text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-neon-blue" />
            Decentralized Energy Grid
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-balance leading-[1.05]">
            <span className="text-foreground">Peer-to-Peer</span>
            <br />
            <span className="neon-text-blue">Energy Trading</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Trade solar energy directly with households on the blockchain. No middlemen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleRole("buyer")}
            className="glass-card group p-8 text-left transition-all duration-300 hover:border-neon-blue/40 cursor-pointer animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-14 h-14 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-6 group-hover:neon-glow-blue transition-shadow duration-300">
              <Zap className="w-7 h-7 text-neon-blue" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Buy Energy</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Purchase clean solar energy at competitive prices from nearby households.
            </p>
            <div className="flex items-center gap-2 text-neon-blue text-sm font-medium">
              Connect as Buyer →
            </div>
          </button>

          <button
            onClick={() => handleRole("seller")}
            className="glass-card-green group p-8 text-left transition-all duration-300 hover:border-neon-green/40 cursor-pointer animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="w-14 h-14 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-6 group-hover:neon-glow-green transition-shadow duration-300">
              <Sun className="w-7 h-7 text-neon-green" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Sell Energy</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Monetize your surplus solar production by selling to buyers in your area.
            </p>
            <div className="flex items-center gap-2 text-neon-green text-sm font-medium">
              Connect as Seller →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
