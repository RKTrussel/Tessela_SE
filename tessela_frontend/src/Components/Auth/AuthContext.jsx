import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        
  const [bootstrapped, setBootstrapped] = useState(false);

  // Bootstrap from localStorage on page refresh
  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
    setBootstrapped(true);
  }, []);

  const login = (payload) => {
    // payload should include at least: { role, ... } and optionally token
    setUser(payload);
    localStorage.setItem("auth:user", JSON.stringify(payload));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth:user");
  };

  const value = useMemo(() => ({ user, login, logout, bootstrapped }), [user, bootstrapped]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}