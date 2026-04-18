import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pn_token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .me()
      .then((profile) => setUser(profile))
      .catch(() => localStorage.removeItem("pn_token"))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem("pn_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    localStorage.setItem("pn_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("pn_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
