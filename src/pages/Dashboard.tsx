import { useEnergy } from "@/contexts/EnergyContext";
import { Navigate } from "react-router-dom";
import BuyerDashboard from "@/components/BuyerDashboard";
import SellerDashboard from "@/components/SellerDashboard";

const Dashboard = () => {
  const { isLoggedIn, userRole } = useEnergy();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return userRole === "buyer" ? <BuyerDashboard /> : <SellerDashboard />;
};

export default Dashboard;
