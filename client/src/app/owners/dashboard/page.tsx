"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Power, MapPin, Store, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function OwnerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Mock State for the Cart details
  const [isOpen, setIsOpen] = useState(false);
  const [cartName, setCartName] = useState("My Awesome Cart");
  const [description, setDescription] = useState("Best burgers in town.");
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Classic Burger", price: 150, isAvailable: true },
    { id: 2, name: "Spicy Fries", price: 80, isAvailable: false },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/owners/login");
    }
  }, [user, loading, router]);

  const handleSaveCartInfo = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cart info saved! (Mocked via localStorage)");
  };

  const toggleMenuItem = (id: number) => {
    setMenuItems(items => items.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: "New Menu Item",
      price: 100,
      isAvailable: true
    };
    setMenuItems([...menuItems, newItem]);
  };

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-24 pb-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-tertiary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 hidden md:block -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 hidden md:block -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl space-y-6"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">Cart Dashboard</h1>
            <p className="text-muted-foreground">Manage your cart details, menu, and operating status.</p>
          </div>

          {/* Master Toggle */}
          <div className="glass-panel px-6 py-4 rounded-2xl flex items-center justify-between gap-4 border border-white/60 shadow-md">
            <div>
              <p className="text-sm font-bold text-foreground">Operating Status</p>
              <p className="text-xs text-muted-foreground">{isOpen ? "Accepting customers" : "Currently closed"}</p>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${isOpen ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cart Information Form */}
          <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Store className="text-primary" size={24} />
              <h2 className="text-xl font-bold text-foreground">Cart Details</h2>
            </div>

            <form onSubmit={handleSaveCartInfo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground ml-1">Cart Name</label>
                <input
                  type="text"
                  value={cartName}
                  onChange={(e) => setCartName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground ml-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value="Sector 11, Uttara"
                    disabled
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100/50 border border-white/60 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground ml-1">Location updates will require GPS access in the final version.</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all text-sm"
              >
                Save Details
              </button>
            </form>
          </div>

          {/* Menu Management */}
          <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Menu Items</h2>
              <button 
                onClick={addNewItem}
                className="flex items-center gap-1 text-xs font-semibold bg-tertiary/20 text-tertiary-foreground px-3 py-1.5 rounded-full hover:bg-tertiary/30 transition-colors"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {menuItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white/40 p-3 rounded-xl border border-white/40">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">৳ {item.price}</p>
                  </div>
                  
                  <button
                    onClick={() => toggleMenuItem(item.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 transition-colors ${
                      item.isAvailable 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {item.isAvailable ? <><Check size={12}/> Available</> : <><X size={12}/> Sold Out</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
