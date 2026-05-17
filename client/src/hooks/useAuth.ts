"use client";

import { useState, useEffect } from "react";

export type User = {
  name: string;
  email: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // We check localStorage on mount to see if a user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("cartkoi_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("cartkoi_user", JSON.stringify(userData));
    setUser(userData);
    // Dispatch a custom event so other components (like TopBar) can update immediately
    window.dispatchEvent(new Event("auth-change"));
  };

  const logout = () => {
    localStorage.removeItem("cartkoi_user");
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
  };

  // Listen for auth-change events to sync state across components
  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = localStorage.getItem("cartkoi_user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  return { user, login, logout, loading };
}
