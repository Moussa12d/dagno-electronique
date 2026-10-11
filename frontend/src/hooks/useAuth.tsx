import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../api/client";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("dagno_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("dagno_user");
      }
    }
    setLoading(false);
  }, []);

  async function login(identifier: string, password: string): Promise<User> {
    const { data } = await api.post("/auth/login", { identifier, password });
    const loggedUser: User = data.data.user;
    const token: string = data.data.accessToken;

    localStorage.setItem("dagno_token", token);
    localStorage.setItem("dagno_user", JSON.stringify(loggedUser));
    setUser(loggedUser);

    return loggedUser;
  }

  function logout() {
    localStorage.removeItem("dagno_token");
    localStorage.removeItem("dagno_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}