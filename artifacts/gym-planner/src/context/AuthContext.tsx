import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";

const API_BASE = "http://localhost:3000";

setBaseUrl(API_BASE);

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export function AuthProvider({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyToken = useCallback((t: string | null) => {
    setToken(t);
    setAuthTokenGetter(t ? () => t : null);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("gymguide_token");
    if (!stored) {
      setIsLoading(false);
      return;
    }
    applyToken(stored);
    apiFetch("/api/auth/me", { headers: { Authorization: `Bearer ${stored}` } })
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("gymguide_token");
        applyToken(null);
      })
      .finally(() => setIsLoading(false));
  }, [applyToken]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("gymguide_token", data.token);
    applyToken(data.token);
    setUser(data.user);
  }, [applyToken]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("gymguide_token", data.token);
    applyToken(data.token);
    setUser(data.user);
  }, [applyToken]);

  const logout = useCallback(() => {
    localStorage.removeItem("gymguide_token");
    applyToken(null);
    setUser(null);
    onLogout?.();
  }, [applyToken, onLogout]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
