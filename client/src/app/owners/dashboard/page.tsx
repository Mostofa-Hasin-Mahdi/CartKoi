"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Power, MapPin, Store, Check, X, Loader2, ArrowLeft, Settings, Link as LinkIcon, Globe, Camera, Clock, Edit2, Trash2, Save, Users, UserX, Navigation, MessageSquare, Star } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";

const LocationUpdater = dynamic(() => import("@/components/LocationUpdater"), { ssr: false });

type ViewState = 'list' | 'create' | 'cart_dashboard' | 'settings' | 'employees';

export default function OwnerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [view, setView] = useState<ViewState>('list');
  const [carts, setCarts] = useState<any[]>([]);
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
  const [isLoadingCarts, setIsLoadingCarts] = useState(true);

  // Form states for creating a new cart
  const [newCartName, setNewCartName] = useState("");

  // States for Cart Settings
  const [cartName, setCartName] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState<number | "">("");
  const [lng, setLng] = useState<number | "">("");
  const [foodpandaLink, setFoodpandaLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [operatingHours, setOperatingHours] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: ""
  });

  // States for Cart Dashboard (Operations)
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cartEmployees, setCartEmployees] = useState<any[]>([]);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  // Menu Management States
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemPrice, setEditItemPrice] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/owners/login");
    }
  }, [user, loading, router]);

  // Load carts from Supabase
  const fetchCarts = async () => {
    if (!user) return;
    setIsLoadingCarts(true);
    const { data, error } = await supabase
      .from("carts")
      .select("*")
      .eq("owner_id", user.id);
    
    if (error) {
      console.error("Error fetching carts:", error);
    } else {
      setCarts(data || []);
    }
    setIsLoadingCarts(false);
  };

  useEffect(() => {
    if (user) {
      fetchCarts();
    }
  }, [user]);

  const handleCreateCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCartName.trim() || !user) return;

    const { data, error } = await supabase
      .from("carts")
      .insert({
        owner_id: user.id,
        name: newCartName,
        description: "My new food cart",
        is_open: false,
        lat: 23.8759,
        lng: 90.3980,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating cart:", error);
      alert("Failed to create cart");
    } else if (data) {
      setCarts([...carts, data]);
      setNewCartName("");
      setView('list');
    }
  };

  const handleSelectCartDashboard = async (cart: any) => {
    setSelectedCartId(cart.id);
    setCartName(cart.name); // Need name for the header
    setIsOpen(cart.is_open || false);
    setLat(cart.lat || "");
    setLng(cart.lng || "");
    
    // Fetch menu items
    const { data: menuData } = await supabase
      .from("menu_items")
      .select("*")
      .eq("cart_id", cart.id)
      .order("created_at", { ascending: false });
      
    setMenuItems(menuData || []);

    // Fetch reviews
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("*")
      .eq("cart_id", cart.id)
      .order("created_at", { ascending: false });
      
    setReviews(reviewData || []);
    
    setView('cart_dashboard');
  };

  const handleSelectCartSettings = (e: React.MouseEvent, cart: any) => {
    e.stopPropagation();
    setSelectedCartId(cart.id);
    setCartName(cart.name);
    setDescription(cart.description || "");
    setLat(cart.lat || "");
    setLng(cart.lng || "");
    setFoodpandaLink(cart.foodpandaLink || "");
    const socialLinks = cart.social_links || {};
    setFacebookLink(socialLinks.facebook || "");
    setInstagramLink(socialLinks.instagram || "");
    setInviteCode(cart.invite_code || "");
    setOperatingHours(cart.operating_hours || {
      monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: ""
    });
    setView('settings');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCartId) return;

    const { error } = await supabase
      .from("carts")
      .update({
        name: cartName,
        description,
        lat: lat === "" ? null : Number(lat),
        lng: lng === "" ? null : Number(lng),
        foodpanda_link: foodpandaLink,
        social_links: { facebook: facebookLink, instagram: instagramLink },
        operating_hours: operatingHours
      })
      .eq("id", selectedCartId);

    if (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    } else {
      alert("Cart settings saved successfully!");
      fetchCarts();
      setView('list');
    }
  };

  const generateInviteCode = async () => {
    if (!selectedCartId) return;
    
    // Generate a random 6-character alphanumeric code
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { error } = await supabase
      .from("carts")
      .update({ invite_code: newCode })
      .eq("id", selectedCartId);
      
    if (error) {
      alert("Failed to generate invite code. It might already be in use.");
    } else {
      setInviteCode(newCode);
      fetchCarts();
    }
  };

  const handleSelectCartEmployees = async (e: React.MouseEvent, cart: any) => {
    e.stopPropagation();
    setSelectedCartId(cart.id);
    setCartName(cart.name);
    setView('employees');
    
    // Fetch employees for this cart
    const { data, error } = await supabase
      .from("cart_employees")
      .select("employee_id, profiles(full_name, id)")
      .eq("cart_id", cart.id);
      
    if (error) {
      console.error("Error fetching employees", error);
    } else {
      // Map to an easier format and filter out nulls
      const emps = data.map((row: any) => row.profiles).filter(Boolean);
      setCartEmployees(emps || []);
    }
  };

  const removeEmployee = async (employeeId: string) => {
    if (!confirm("Are you sure you want to remove this employee?")) return;
    
    const { error } = await supabase
      .from("cart_employees")
      .delete()
      .match({ cart_id: selectedCartId, employee_id: employeeId });
      
    if (error) {
      alert("Failed to remove employee.");
    } else {
      setCartEmployees(cartEmployees.filter(emp => emp.id !== employeeId));
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);
      
    if (error) {
      alert("Failed to delete review.");
    } else {
      setReviews(reviews.filter(r => r.id !== reviewId));
    }
  };

  const handleBulkSoldOut = async () => {
    if (!selectedCartId) return;
    setIsUpdatingBulk(true);
    
    // Optimistic UI update
    const previousItems = [...menuItems];
    setMenuItems(menuItems.map(item => ({ ...item, is_available: false })));
    
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: false })
      .eq("cart_id", selectedCartId);
      
    if (error) {
      setMenuItems(previousItems);
      alert("Failed to mark all as sold out. Check permissions.");
    }
    setIsUpdatingBulk(false);
  };

  const handleSaveLocation = async (newLat: number, newLng: number) => {
    if (!selectedCartId) return;
    setIsSavingLocation(true);
    
    const { error } = await supabase
      .from("carts")
      .update({ lat: newLat, lng: newLng })
      .eq("id", selectedCartId);
      
    if (error) {
      alert("Failed to update location.");
    } else {
      setLat(newLat);
      setLng(newLng);
      alert("Location saved successfully! The map will now show the cart here.");
      fetchCarts(); // update list
    }
    setIsSavingLocation(false);
  };

  const handleToggleOpen = async () => {
    if (!selectedCartId) return;
    const newStatus = !isOpen;
    setIsOpen(newStatus); // optimistic update

    const { error } = await supabase
      .from("carts")
      .update({ is_open: newStatus })
      .eq("id", selectedCartId);
      
    if (error) {
      setIsOpen(!newStatus); // revert
      alert("Failed to update status");
    } else {
      fetchCarts(); // background refresh
    }
  };

  const toggleMenuItem = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, is_available: !currentStatus } : item
    ));
    
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: !currentStatus })
      .eq("id", id);
      
    if (error) {
      // Revert if error
      setMenuItems(menuItems.map(item => 
        item.id === id ? { ...item, is_available: currentStatus } : item
      ));
      alert("Failed to update menu item status.");
    }
  };

  const saveNewItem = async () => {
    if (!newItemName.trim() || !newItemPrice || !selectedCartId) return;
    
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        cart_id: selectedCartId,
        name: newItemName,
        price: Number(newItemPrice),
        is_available: true
      })
      .select()
      .single();

    if (error) {
      alert("Failed to add menu item.");
    } else if (data) {
      setMenuItems([data, ...menuItems]);
      setIsAddingItem(false);
      setNewItemName("");
      setNewItemPrice("");
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete menu item.");
    } else {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const startEditing = (item: any) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemPrice(item.price.toString());
  };

  const saveEditedItem = async (id: string) => {
    if (!editItemName.trim() || !editItemPrice) return;

    const { error } = await supabase
      .from("menu_items")
      .update({
        name: editItemName,
        price: Number(editItemPrice)
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update menu item.");
    } else {
      setMenuItems(menuItems.map(item => 
        item.id === id ? { ...item, name: editItemName, price: Number(editItemPrice) } : item
      ));
      setEditingItemId(null);
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
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${cart.is_open ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {cart.is_open ? 'Open' : 'Closed'}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{cart.name}</h3>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{cart.description}</p>
                      
                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={(e) => handleSelectCartEmployees(e, cart)}
                          className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 font-semibold text-sm transition-all flex items-center justify-center gap-1.5 z-10"
                        >
                          <Users size={14} /> Employees
                        </button>
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
                  <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1"><MapPin size={14} className="text-primary"/> Coordinates (Lat/Lng)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      step="any"
                      value={lat}
                      onChange={(e) => setLat(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                      placeholder="Latitude (e.g. 23.8759)"
                    />
                    <input
                      type="number"
                      step="any"
                      value={lng}
                      onChange={(e) => setLng(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                      placeholder="Longitude (e.g. 90.3980)"
                    />
                  </div>
                </div>

                <hr className="border-white/40 my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><Clock size={18} className="text-primary"/> Operating Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day} className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground ml-1 capitalize">{day}</label>
                        <input
                          type="text"
                          value={(operatingHours as any)[day]}
                          onChange={(e) => setOperatingHours({ ...operatingHours, [day]: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          placeholder="e.g. 10am - 8pm, or Closed"
                        />
                      </div>
                    ))}
                  </div>
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

                <hr className="border-white/40 my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Employee Access</h3>
                  <p className="text-sm text-muted-foreground">Share this code with your employees so they can join this cart.</p>
                  
                  <div className="flex items-center gap-3 bg-white/50 p-4 rounded-xl border border-white/60">
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase text-slate-500 mb-1">Invite Code</p>
                      {inviteCode ? (
                        <p className="text-2xl font-black text-slate-800 tracking-widest">{inviteCode}</p>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No code generated yet</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={generateInviteCode}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors"
                    >
                      {inviteCode ? "Regenerate" : "Generate Code"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all text-sm"
                >
                  Save Settings
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {view === 'employees' && (
          <motion.div
            key="employees"
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
              <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">{cartName} Employees</h1>
              <p className="text-muted-foreground">Manage the staff assigned to this cart.</p>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg min-h-[300px]">
              <div className="space-y-3">
                {cartEmployees.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Users size={40} className="mx-auto text-slate-300 mb-3" />
                    <p>No employees are assigned to this cart yet.</p>
                    <p className="text-sm mt-2">Go to Cart Settings to generate an Invite Code.</p>
                  </div>
                ) : (
                  cartEmployees.map(emp => (
                    <div key={emp.id} className="flex items-center justify-between bg-white/60 p-4 rounded-xl shadow-sm border border-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {emp?.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{emp?.full_name || "Unknown User"}</p>
                          <p className="text-xs text-muted-foreground">ID: {emp?.id?.substring(0, 8)}...</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeEmployee(emp?.id)}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
                        title="Remove Employee"
                      >
                        <UserX size={16} /> Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Live Menu Stock</h2>
                  <p className="text-xs text-muted-foreground mt-1">Toggle items as they sell out so customers know what's available.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleBulkSoldOut}
                    disabled={isUpdatingBulk || menuItems.every(i => !i.is_available) || menuItems.length === 0}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-3 py-1.5 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    {isUpdatingBulk ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} Mark All Sold Out
                  </button>
                  {!isAddingItem && (
                    <button 
                      onClick={() => setIsAddingItem(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs font-semibold bg-tertiary/20 text-tertiary-foreground px-3 py-1.5 rounded-full hover:bg-tertiary/30 transition-colors"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  )}
                </div>
              </div>

              {isAddingItem && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4 flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="number"
                    placeholder="Price (৳)"
                    value={newItemPrice}
                    onChange={e => setNewItemPrice(e.target.value)}
                    className="w-full md:w-32 px-3 py-2 rounded-lg bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveNewItem} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90">Save</button>
                    <button onClick={() => setIsAddingItem(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300">Cancel</button>
                  </div>
                </div>
              )}

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {menuItems.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/40 p-4 rounded-xl border border-white/40 shadow-sm transition-all hover:bg-white/60 group gap-3">
                    {editingItemId === item.id ? (
                      <div className="flex-1 flex flex-col md:flex-row gap-3 mr-4">
                        <input
                          type="text"
                          value={editItemName}
                          onChange={e => setEditItemName(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <input
                          type="number"
                          value={editItemPrice}
                          onChange={e => setEditItemPrice(e.target.value)}
                          className="w-full md:w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <div className="flex gap-1">
                          <button onClick={() => saveEditedItem(item.id)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><Save size={16}/></button>
                          <button onClick={() => setEditingItemId(null)} className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"><X size={16}/></button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="font-semibold text-base text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">৳ {item.price}</p>
                      </div>
                    )}
                    
                    {editingItemId !== item.id && (
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Edit & Delete Actions (Hidden on mobile unless hovered, or always visible) */}
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditing(item)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Edit2 size={16}/></button>
                          <button onClick={() => deleteMenuItem(item.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16}/></button>
                        </div>
                        
                        <button
                          onClick={() => toggleMenuItem(item.id, item.is_available)}
                          className={`px-4 py-2 text-sm font-bold rounded-full flex items-center justify-center gap-1.5 transition-colors flex-1 sm:flex-none ${
                            item.is_available 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {item.is_available ? <><Check size={16}/> Available</> : <><X size={16}/> Sold Out</>}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {menuItems.length === 0 && !isAddingItem && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p>No menu items yet.</p>
                    <button 
                      onClick={() => setIsAddingItem(true)}
                      className="mt-2 text-primary text-sm font-semibold hover:underline"
                    >
                      Add your first item
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Location Map Section */}
            <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg mt-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Navigation size={20} className="text-blue-500" /> Live Location</h2>
                <p className="text-xs text-muted-foreground mt-1">Drag the marker to update your cart's exact location for customers.</p>
              </div>
              <LocationUpdater 
                initialLat={lat === "" ? null : lat} 
                initialLng={lng === "" ? null : lng} 
                onSave={handleSaveLocation} 
                isSaving={isSavingLocation} 
              />
            </div>

            {/* Reviews Moderation Section */}
            <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg mt-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><MessageSquare size={20} className="text-primary" /> Review Moderation</h2>
                <p className="text-xs text-muted-foreground mt-1">Monitor and delete inappropriate anonymous reviews for your cart.</p>
              </div>
              
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="bg-white/50 p-5 rounded-2xl border border-white/60 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800">{review.reviewer_name}</h4>
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-bold">{review.rating}</span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-slate-600 text-sm mt-2">{review.comment}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition flex items-center gap-1 self-start"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground bg-white/40 rounded-2xl border border-white/40">
                    <MessageSquare size={32} className="mx-auto mb-2 text-slate-300" />
                    <p>No reviews yet.</p>
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
