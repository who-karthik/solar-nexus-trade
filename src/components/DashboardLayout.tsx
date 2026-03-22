import { useEnergy } from "@/contexts/EnergyContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Store, FileText, BarChart3, LogOut, Zap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/marketplace", label: "Marketplace", icon: Store },
  { to: "/transactions", label: "Ledger", icon: FileText },
  { to: "/visualization", label: "Analytics", icon: BarChart3 },
];

const DashboardLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const { userName, walletAddress, userRole, logout, alerts } = useEnergy();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen grid-bg">
      {/* Top bar */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-neon-blue" />
              <span className="font-bold text-foreground text-sm">EnergyGrid</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {alerts.length > 0 && (
              <div className="relative">
                <Bell className="w-4 h-4 text-neon-green" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
              </div>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-foreground">{userName}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{walletAddress.slice(0, 10)}...</p>
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
              userRole === "buyer" ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20" : "bg-neon-green/10 text-neon-green border border-neon-green/20"
            }`}>
              {userRole}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-14 z-40">
        <div className="flex px-2 py-1.5 gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  active ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {alerts.slice(0, 3).map((alert, i) => (
              <div
                key={i}
                className="px-3 py-1.5 rounded-lg bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs whitespace-nowrap animate-slide-in-left"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
