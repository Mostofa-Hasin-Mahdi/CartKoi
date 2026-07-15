"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, User, Phone, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import NavBar from "@/components/NavBar";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone_number")
        .eq("id", user.id)
        .single();
      
      if (!error && data) {
        setFullName(data.full_name || "");
        setPhoneNumber(data.phone_number || "");
      }
      setInitialLoad(false);
    };

    fetchProfile();
  }, [user, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone_number: phoneNumber,
      })
      .eq("id", user.id);

    setIsSaving(false);

    if (error) {
      alert("Failed to update profile.");
    } else {
      alert("Profile updated successfully!");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || initialLoad) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 pt-24 pb-32 relative overflow-hidden">
      <NavBar />

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 hidden md:block pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 hidden md:block pointer-events-none" />

      <div className="max-w-xl w-full mx-auto px-4 z-10">
        <div className="bg-white/70 backdrop-blur-md border border-white/60 p-8 rounded-3xl shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
          <p className="text-slate-500 mb-8">Update your personal details and contact information.</p>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                  placeholder="+880 123 456 7890"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                This helps employees/owners contact you directly regarding cart operations.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </form>

          <div className="mt-12 pt-6 border-t border-slate-200">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-500 font-semibold hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
