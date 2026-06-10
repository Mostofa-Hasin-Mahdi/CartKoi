"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Power, MapPin, Store, Check, X, Loader2, ArrowLeft, Settings, Link as LinkIcon, Globe, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type ViewState = 'list' | 'create' | 'cart_dashboard' | 'settings';

export default function OwnerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<ViewState>('list');
  const [carts, setCarts] = useState<any[]>([]);
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);

  // Form states for creating a new cart
  const [newCartName, setNewCartName] = useState("");

  // States for Cart Settings
  const [cartName, setCartName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Sector 11, Uttara");
  const [foodpandaLink, setFoodpandaLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");

  // States for Cart Dashboard (Operations)
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/owners/login");
    }
  }, [user, loading, router]);

  // Load carts from local storage
  useEffect(() => {
    const storedCarts = localStorage.getItem("cartkoi_carts");
    if (storedCarts) {
      setCarts(JSON.parse(storedCarts));
    }
  }, []);

  // Save carts to local storage whenever they change
  const saveCarts = (updatedCarts: any[]) => {
    setCarts(updatedCarts);
    localStorage.setItem("cartkoi_carts", JSON.stringify(updatedCarts));
  };

  const handleCreateCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCartName.trim()) return;

    const newCart = {
      id: Date.now().toString(),
      name: newCartName,
      description: "My new food cart",
      location: "Sector 11, Uttara",
      foodpandaLink: "",
      facebookLink: "",
      instagramLink: "",
      isOpen: false,
      menuItems: [
        { id: 1, name: "Classic Burger", price: 150, isAvailable: true },
        { id: 2, name: "Spicy Fries", price: 80, isAvailable: true },
      ]
    };

    saveCarts([...carts, newCart]);
    setNewCartName("");
    setView('list');
  };

  const handleSelectCartDashboard = (cart: any) => {
    setSelectedCartId(cart.id);
    setCartName(cart.name); // Need name for the header
    setIsOpen(cart.isOpen || false);
    setMenuItems(cart.menuItems || []);
    setView('cart_dashboard');
  };

  const handleSelectCartSettings = (e: React.MouseEvent, cart: any) => {
    e.stopPropagation();
    setSelectedCartId(cart.id);
    setCartName(cart.name);
    setDescription(cart.description || "");
    setLocation(cart.location || "Sector 11, Uttara");
    setFoodpandaLink(cart.foodpandaLink || "");
    setFacebookLink(cart.facebookLink || "");
    setInstagramLink(cart.instagramLink || "");
    setView('settings');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCarts = carts.map(c => 
      c.id === selectedCartId ? { 
        ...c, 
        name: cartName, 
        description, 
        location,
        foodpandaLink,
        facebookLink,
        instagramLink
      } : c
    );
    saveCarts(updatedCarts);
    alert("Cart settings saved! (Mocked via localStorage)");
    setView('list');
  };

  // Keep toggle state in sync with the carts array when saved
  const handleToggleOpen = () => {
    const newStatus = !isOpen;
    setIsOpen(newStatus);
    const updatedCarts = carts.map(c => 
      c.id === selectedCartId ? { ...c, isOpen: newStatus } : c
    );
    saveCarts(updatedCarts);
  };

  const toggleMenuItem = (id: number) => {
    const updatedItems = menuItems.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    setMenuItems(updatedItems);
    
    // Auto-save menu changes
    const updatedCarts = carts.map(c => 
      c.id === selectedCartId ? { ...c, menuItems: updatedItems } : c
    );
    saveCarts(updatedCarts);
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: "New Menu Item",
      price: 100,
      isAvailable: true
    };
    const updatedItems = [...menuItems, newItem];
    setMenuItems(updatedItems);
    
    const updatedCarts = carts.map(c => 
      c.id === selectedCartId ? { ...c, menuItems: updatedItems } : c
    );
    saveCarts(updatedCarts);
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
              <p className="text-muted-foreground">Manage your food carts and operations from here.</p>
            </div>

            {carts.length === 0 ? (
              <div className="glass-panel p-12 rounded-[2rem] border border-white/60 shadow-lg text-center flex flex-col items-center justify-center">
                <Store className="text-slate-400 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-foreground mb-2">No Food Carts Yet</h2>
                <p className="text-muted-foreground mb-6">You haven't created any food carts. Get started by creating your first cart!</p>
                <button
                  onClick={() => setView('create')}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={18} /> Create Food Cart
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Your Food Carts</h2>
                  <button
                    onClick={() => setView('create')}
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-all flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> New Cart
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {carts.map(cart => (
                    <div 
                      key={cart.id} 
                      onClick={() => handleSelectCartDashboard(cart)}
                      className="glass-panel p-6 rounded-[1.5rem] border border-white/60 shadow-md hover:shadow-lg transition-all flex flex-col cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                          <Store size={24} />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${cart.isOpen ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {cart.isOpen ? 'Open' : 'Closed'}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{cart.name}</h3>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{cart.description}</p>
                      
                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={(e) => handleSelectCartSettings(e, cart)}
                          className="flex-1 py-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 font-semibold text-sm transition-all flex items-center justify-center gap-1.5 z-10"
                        >
                          <Settings size={14} /> Settings
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {view === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-auto"
          >
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            
            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-xl border-white/60">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-4">
                  <Store size={32} />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Create New Cart</h1>
                <p className="text-sm text-muted-foreground">Give your new food cart a name to get started.</p>
              </div>

              <form onSubmit={handleCreateCart} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">Cart Name</label>
                  <input
                    type="text"
                    required
                    value={newCartName}
                    onChange={(e) => setNewCartName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm placeholder:text-slate-400"
                    placeholder="e.g. Burger Express"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                >
                  Create Cart
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {view === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto space-y-6"
          >
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft size={16} /> Back to All Carts
            </button>

            <div className="mb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Cart Settings</h1>
              <p className="text-muted-foreground">Update public profile and social links for {cartName}.</p>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg">
              <form onSubmit={handleSaveSettings} className="space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1"><Store size={14} className="text-primary"/> Cart Name</label>
                  <input
                    type="text"
                    required
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
                    placeholder="Describe your cart..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1"><MapPin size={14} className="text-primary"/> Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    placeholder="E.g. Sector 11, Uttara"
                  />
                  <p className="text-[10px] text-muted-foreground ml-1">Location will eventually be powered by GPS in the final version.</p>
                </div>

                <hr className="border-white/40 my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Social & Delivery Links</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1"><LinkIcon size={14} className="text-primary"/> FoodPanda Link</label>
                    <input
                      type="url"
                      value={foodpandaLink}
                      onChange={(e) => setFoodpandaLink(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                      placeholder="https://www.foodpanda.bd/..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1"><Globe size={14} className="text-blue-500"/> Facebook</label>
                      <input
                        type="url"
                        value={facebookLink}
                        onChange={(e) => setFacebookLink(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1"><Camera size={14} className="text-pink-500"/> Instagram</label>
                      <input
                        type="url"
                        value={instagramLink}
                        onChange={(e) => setInstagramLink(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all text-sm"
                >
                  Save Settings
                </button>
              </form>
            </div>
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
              <ArrowLeft size={16} /> Back to All Carts
            </button>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">{cartName} Dashboard</h1>
                <p className="text-muted-foreground">Manage operations and live menu availability.</p>
              </div>

              {/* Master Toggle */}
              <div className="glass-panel px-6 py-4 rounded-2xl flex items-center justify-between gap-4 border border-white/60 shadow-md">
                <div>
                  <p className="text-sm font-bold text-foreground">Operating Status</p>
                  <p className="text-xs text-muted-foreground">{isOpen ? "Accepting customers" : "Currently closed"}</p>
                </div>
                <button
                  onClick={handleToggleOpen}
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

            {/* Menu Management - Expanded full width for dashboard */}
            <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Live Menu Stock</h2>
                  <p className="text-xs text-muted-foreground mt-1">Toggle items as they sell out so customers know what's available.</p>
                </div>
                <button 
                  onClick={addNewItem}
                  className="flex items-center gap-1 text-xs font-semibold bg-tertiary/20 text-tertiary-foreground px-3 py-1.5 rounded-full hover:bg-tertiary/30 transition-colors"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {menuItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-white/40 p-4 rounded-xl border border-white/40 shadow-sm transition-all hover:bg-white/60">
                    <div>
                      <p className="font-semibold text-base text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">৳ {item.price}</p>
                    </div>
                    
                    <button
                      onClick={() => toggleMenuItem(item.id)}
                      className={`px-4 py-2 text-sm font-bold rounded-full flex items-center gap-1.5 transition-colors ${
                        item.isAvailable 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {item.isAvailable ? <><Check size={16}/> Available</> : <><X size={16}/> Sold Out</>}
                    </button>
                  </div>
                ))}
                {menuItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p>No menu items yet.</p>
                    <button 
                      onClick={addNewItem}
                      className="mt-2 text-primary text-sm font-semibold hover:underline"
                    >
                      Add your first item
                    </button>
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
