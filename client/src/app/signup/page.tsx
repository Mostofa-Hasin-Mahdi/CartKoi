"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would register a new user in the backend
    login({ name: name || "New User", email });
    router.push("/");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-tertiary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float hidden md:block -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float hidden md:block -z-10" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-xl border-white/60">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-sm text-muted-foreground">Join CartKoi to explore local food carts</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm placeholder:text-slate-400"
                placeholder="Mostofa Hasin"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm placeholder:text-slate-400"
                placeholder="mostofa@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-full bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
