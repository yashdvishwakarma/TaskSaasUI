import { useState } from "react";
import { login, register, type AuthResponse } from "../api/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const doLogin = async (email: string, password: string) => {
    const { data } = await login(email, password);
    localStorage.setItem("token", data.data.token );
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data.data);
  };

  const doRegister = async (fullName: string, email: string, password: string , Role : int) => {
    const { data } = await register(fullName, email, password, Role);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, doLogin, doRegister, logout };
}