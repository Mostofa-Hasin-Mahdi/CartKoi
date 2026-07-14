"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function EmployeeSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "employee", // KEY DIFFERENCE: defaulting to employee
          },
        },
      });

      if (signUpError) throw signUpError;

      // Because email confirmation is disabled, user is signed in immediately
      if (data.session) {
        router.push("/employees/dashboard");
      } else {
        // Fallback just in case
        router.push("/owners/login");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float hidden md:block -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float hidden md:block -z-10" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-xl border-white/60">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Employee Signup</h1>
            <p className="text-sm text-muted-foreground">Join a CartKoi team</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm placeholder:text-slate-400"
                placeholder="Rahim Ali"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm placeholder:text-slate-400"
                placeholder="rahim@example.com"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm placeholder:text-slate-400"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground flex flex-col gap-2">
            <p>
              Already have an account?{" "}
              <Link href="/owners/login" className="font-semibold text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
            <p>
              Are you an owner?{" "}
              <Link href="/owners/signup" className="font-semibold text-primary hover:underline">
                Owner Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
