import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function RequireAuth() {
  const { user, bootstrapped } = useAuth();
  const location = useLocation();

  if (!bootstrapped) return null;
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  return <Outlet />;
}