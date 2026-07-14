"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Power, MapPin, Store, Check, X, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";

type ViewState = 'list' | 'cart_dashboard';

export default function EmployeeDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [view, setView] = useState<ViewState>('list');
  const [carts, setCarts] = useState<any[]>([]);
  const [isLoadingCarts, setIsLoadingCarts] = useState(true);

  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);

  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
  const [cartName, setCartName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/owners/login");
    }
  }, [user, loading, router]);

  const fetchAssignedCarts = async () => {
    if (!user) return;
    setIsLoadingCarts(true);
    
    // We join carts with cart_employees
    const { data, error } = await supabase
      .from('cart_employees')
      .select('carts(*)')
      .eq('employee_id', user.id);
      
    if (error) {
      console.error("Error fetching carts:", error);
    } else if (data) {
      // The join returns { carts: { ...cartData } }
      const formattedCarts = data.map((row: any) => row.carts).filter(Boolean);
      setCarts(formattedCarts);
    }
    setIsLoadingCarts(false);
  };

  useEffect(() => {
    if (user) {
      fetchAssignedCarts();
    }
  }, [user]);

  const handleJoinCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !user) return;
    setJoining(true);

    try {
      // 1. Find the cart by invite code
      const { data: cartData, error: cartError } = await supabase
        .from("carts")
        .select("id")
        .eq("invite_code", inviteCode.toUpperCase())
        .single();
        
      if (cartError || !cartData) {
        throw new Error("Invalid Invite Code. Please try again.");
      }
      
      // 2. Insert into cart_employees
      const { error: assignError } = await supabase
        .from("cart_employees")
        .insert({
          cart_id: cartData.id,
          employee_id: user.id
        });
        
      if (assignError) {
        // Checking for uniqueness violation
        if (assignError.code === '23505') throw new Error("You are already assigned to this cart.");
        throw assignError;
      }
      
      alert("Successfully joined the cart!");
      setInviteCode("");
      fetchAssignedCarts();
      
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setJoining(false);
    }
  };

  const handleSelectCartDashboard = async (cart: any) => {
    setSelectedCartId(cart.id);
    setCartName(cart.name);
    setIsOpen(cart.is_open || false);
    
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("cart_id", cart.id)
      .order("created_at", { ascending: false });
      
    setMenuItems(data || []);
    setView('cart_dashboard');
  };

  const handleToggleOpen = async () => {
    if (!selectedCartId) return;
    const newStatus = !isOpen;
    setIsOpen(newStatus); 

    const { error } = await supabase
      .from("carts")
      .update({ is_open: newStatus })
      .eq("id", selectedCartId);
      
    if (error) {
      setIsOpen(!newStatus);
      alert("Failed to update status. Check permissions.");
    } else {
      fetchAssignedCarts(); 
    }
  };

  const toggleMenuItem = async (id: string, currentStatus: boolean) => {
    // Phase 8 will fully implement this, but we'll wire the UI now
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, is_available: !currentStatus } : item
    ));
    
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: !currentStatus })
      .eq("id", id);
      
    if (error) {
      setMenuItems(menuItems.map(item => 
        item.id === id ? { ...item, is_available: currentStatus } : item
      ));
      alert("Failed to update menu item status. Check permissions.");
    }
  };

  if (loading || !user || isLoadingCarts) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-24 pb-32 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 hidden md:block -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 hidden md:block -z-10" />

      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl space-y-8"
          >
            <div className="text-center md:text-left mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">Welcome, {user.name}</h1>
              <p className="text-muted-foreground">Employee Dashboard - Manage your assigned carts.</p>
            </div>

            {/* Join Cart Section */}
            <div className="bg-white/50 border border-white/60 p-6 rounded-2xl shadow-sm mb-8">
              <h3 className="font-bold text-lg mb-2">Join a Cart</h3>
              <p className="text-sm text-muted-foreground mb-4">Enter the 6-character Invite Code provided by the owner to manage their cart.</p>
              <form onSubmit={handleJoinCart} className="flex gap-3">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase tracking-widest font-bold text-slate-700"
                  placeholder="e.g. A1B2C3"
                />
                <button
                  type="submit"
                  disabled={joining}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {joining ? <Loader2 size={16} className="animate-spin" /> : null}
                  Join
                </button>
              </form>
            </div>

            {carts.length === 0 ? (
              <div className="glass-panel p-12 rounded-[2rem] border border-white/60 shadow-lg text-center flex flex-col items-center justify-center">
                <Store className="text-slate-400 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-foreground mb-2">No Assigned Carts</h2>
                <p className="text-muted-foreground mb-6">You haven't joined any carts yet. Use an invite code above to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Assigned Carts</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {carts.map(cart => (
                    <div 
                      key={cart.id} 
                      onClick={() => handleSelectCartDashboard(cart)}
                      className="glass-panel p-6 rounded-[1.5rem] border border-white/60 shadow-md hover:shadow-lg transition-all flex flex-col cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                          <Store size={24} />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${cart.is_open ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {cart.is_open ? 'Open' : 'Closed'}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{cart.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{cart.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {view === 'cart_dashboard' && (
          <motion.div
            key="cart_dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl space-y-6"
          >
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft size={16} /> Back to My Carts
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">{cartName} Operations</h1>
                <p className="text-muted-foreground">Manage the open status and menu availability.</p>
              </div>

              <div className="glass-panel px-6 py-4 rounded-2xl flex items-center justify-between gap-4 border border-white/60 shadow-md">
                <div>
                  <p className="text-sm font-bold text-foreground">Operating Status</p>
                  <p className="text-xs text-muted-foreground">{isOpen ? "Accepting customers" : "Currently closed"}</p>
                </div>
                <button
                  onClick={handleToggleOpen}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${isOpen ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <motion.div
                    layout
                    className="bg-white w-6 h-6 rounded-full shadow-sm flex items-center justify-center"
                    initial={false}
                    animate={{ x: isOpen ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Power size={12} className={isOpen ? 'text-green-500' : 'text-slate-400'} />
                  </motion.div>
                </button>
              </div>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg flex flex-col min-h-[400px]">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Menu Stock</h2>
                <p className="text-xs text-muted-foreground mt-1">Mark items as sold out when they run out.</p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {menuItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-white/40 p-4 rounded-xl border border-white/40 shadow-sm transition-all hover:bg-white/60">
                    <div>
                      <p className="font-semibold text-base text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">৳ {item.price}</p>
                    </div>
                    
                    <button
                      onClick={() => toggleMenuItem(item.id, item.is_available)}
                      className={`px-4 py-2 text-sm font-bold rounded-full flex items-center gap-1.5 transition-colors ${
                        item.is_available 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {item.is_available ? <><Check size={16}/> Available</> : <><X size={16}/> Sold Out</>}
                    </button>
                  </div>
                ))}
                {menuItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p>No menu items available.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
