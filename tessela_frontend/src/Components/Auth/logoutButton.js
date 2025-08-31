import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api from "../../api";
import Button from "react-bootstrap/Button";

export default function LogoutButton({ className, children = "Logout" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // If you're using Laravel session/Sanctum cookies:
      await api.post("/logout"); // withCredentials should be true in api.js if cookie-based
    } catch (e) {
      // Even if server call fails, still clear local state
      console.warn("Logout request failed, clearing client state anyway.", e);
    } finally {
      logout();            // clears context + localStorage
      navigate("/auth", { replace: true });
    }
  };

  return (
    <Button onClick={handleLogout} className={className}>
      {children}
    </Button>
  );
}