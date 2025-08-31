import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Outlet } from "react-router-dom";

export default function RequireRole({ allow = [] }) {
  const { user, bootstrapped } = useAuth();
  if (!bootstrapped) return null;

  const role = String(user?.role ?? "").trim().toLowerCase();
  const allowSet = allow.map(r => String(r).toLowerCase());

  if (!user) return <Navigate to="/auth" replace />;
  if (!allowSet.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
