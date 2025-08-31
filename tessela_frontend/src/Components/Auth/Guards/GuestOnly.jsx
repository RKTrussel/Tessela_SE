import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function GuestOnly() {
  const { user, bootstrapped } = useAuth();
  const location = useLocation();
  if (!bootstrapped) return null;

  if (user) {
    const role = String(user.role ?? "").trim().toLowerCase();
    
    const from = location.state?.from?.pathname;
    const target = from ?? (role === "admin" ? "/dashboard" : "/");
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
}