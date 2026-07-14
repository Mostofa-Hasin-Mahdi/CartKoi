"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "employee";
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          await fetchProfile(session.user);
        } else if (mounted) {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        if (mounted) setLoading(false);
      }
    }

    async function fetchProfile(authUser: any) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", authUser.id)
          .single();

        if (error) throw error;
        
        if (mounted) {
          setUser({
            id: authUser.id,
            name: data?.full_name || authUser.user_metadata?.full_name || "Unknown",
            email: authUser.email || "",
            role: data?.role || "owner"
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          if (mounted) setLoading(true);
          await fetchProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { user, logout, loading, supabase };
}
