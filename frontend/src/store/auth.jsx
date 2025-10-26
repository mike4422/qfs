// src/store/auth.js
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../lib/api";

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const d = jwtDecode(token);
        const u = { id: d.sub, email: d.email, role: d.role };
        setUser(u);
        // keep Admin.jsx (which reads qfs_user) in sync on refresh/hard-load
        if (!localStorage.getItem("qfs_user")) {
          localStorage.setItem("qfs_user", JSON.stringify({ ...u, token }));
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("qfs_user");
      }
    }
  }, []);

  // ✅ fixed (removed duplicate /api)
  const refresh = async () => {
    const { data } = await api.get("/users/me");
    if (data?.user) setUser(data.user);
    return data.user;
  };

  // ✅ fixed (removed duplicate /api)
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    localStorage.setItem("qfs_user", JSON.stringify({ ...data.user, token: data.token }));
    return data.user;
  };

  // ✅ fixed (removed duplicate /api)
  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("qfs_user");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
