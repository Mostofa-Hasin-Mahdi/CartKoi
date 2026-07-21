"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Power, MapPin, Store, Check, X, Loader2, ArrowLeft, Settings, Link as LinkIcon, Globe, Camera, Clock, Edit2, Trash2, Save, Users, UserX, Navigation, MessageSquare, Star, Image as ImageIcon, Phone, TrendingUp, TrendingDown, Award } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { OperatingHours } from "@/utils/hours";
import { compressImage } from "@/utils/imageCompression";
import NavBar from "@/components/NavBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const LocationUpdater = dynamic(() => import("@/components/LocationUpdater"), { ssr: false });

type ViewState = 'list' | 'create' | 'cart_dashboard' | 'settings' | 'employees' | 'sales_insights';

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
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemImage, setNewItemImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemPrice, setEditItemPrice] = useState("");
  const [editItemDescription, setEditItemDescription] = useState("");
  const [editItemImage, setEditItemImage] = useState<File | null>(null);

  // Sales Insights States
  const [salesLogs, setSalesLogs] = useState<any[]>([]);
  const [aiSalesInsight, setAiSalesInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [saleAmount, setSaleAmount] = useState("");
  const [saleLocationName, setSaleLocationName] = useState("");
  const [saleLat, setSaleLat] = useState<number | "">("");
  const [saleLng, setSaleLng] = useState<number | "">("");

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
    setFoodpandaLink(cart.foodpanda_link || "");
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

    const formatUrl = (url: string) => {
      if (!url.trim()) return "";
      if (!/^https?:\/\//i.test(url.trim())) {
        return `https://${url.trim()}`;
      }
      return url.trim();
    };

    const { error } = await supabase
      .from("carts")
      .update({
        name: cartName,
        description,
        lat: lat === "" ? null : Number(lat),
        lng: lng === "" ? null : Number(lng),
        foodpanda_link: formatUrl(foodpandaLink),
        social_links: { facebook: formatUrl(facebookLink), instagram: formatUrl(instagramLink) },
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
      .select("employee_id, profiles(full_name, id, phone_number)")
      .eq("cart_id", cart.id);
      
    if (error) {
      console.error("Error fetching employees", error);
    } else {
      // Map to an easier format and filter out nulls
      const emps = data.map((row: any) => row.profiles).filter(Boolean);
      setCartEmployees(emps || []);
    }
  };

  const handleSelectSalesInsights = async (e: React.MouseEvent, cart: any) => {
    e.stopPropagation();
    setSelectedCartId(cart.id);
    setCartName(cart.name);
    setAiSalesInsight(cart.ai_sales_insight || null);
    setSaleLat(cart.lat || "");
    setSaleLng(cart.lng || "");
    setView('sales_insights');
    
    const { data } = await supabase
      .from("sales_logs")
      .select("*")
      .eq("cart_id", cart.id)
      .order("created_at", { ascending: false });
      
    setSalesLogs(data || []);
  };

  const handleAddSaleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCartId || !saleAmount || !saleLocationName) return;

    const { data, error } = await supabase
      .from("sales_logs")
      .insert({
        cart_id: selectedCartId,
        amount: Number(saleAmount),
        location_name: saleLocationName,
        lat: saleLat === "" ? null : Number(saleLat),
        lng: saleLng === "" ? null : Number(saleLng)
      })
      .select()
      .single();

    if (error) {
      alert("Failed to log sale.");
    } else if (data) {
      setSalesLogs([data, ...salesLogs]);
      setSaleAmount("");
      // Keep location name/coords for consecutive logs
    }
  };

  const generateAIInsight = async () => {
    if (!selectedCartId) return;
    setIsGeneratingInsight(true);
    try {
      const res = await fetch(`/api/cart/${selectedCartId}/sales-insights`);
      if (res.ok) {
        const data = await res.json();
        setAiSalesInsight(data.insight);
      } else {
        alert("Failed to generate insight.");
      }
    } catch (err) {
      console.error(err);
      alert("Error calling AI.");
    }
    setIsGeneratingInsight(false);
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

  const uploadImage = async (file: File) => {
    // Compress the image before uploading
    const compressedFile = await compressImage(file);
    
    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('cart_images')
      .upload(filePath, compressedFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('cart_images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const saveNewItem = async () => {
    if (!newItemName.trim() || !newItemPrice || !selectedCartId) return;
    setIsUploading(true);

    let imageUrl = null;
    if (newItemImage) {
      imageUrl = await uploadImage(newItemImage);
    }
    
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        cart_id: selectedCartId,
        name: newItemName,
        price: Number(newItemPrice),
        description: newItemDescription,
        is_available: true,
        image_url: imageUrl
      })
      .select()
      .single();

    setIsUploading(false);

    if (error) {
      alert("Failed to add menu item.");
    } else if (data) {
      setMenuItems([data, ...menuItems]);
      setIsAddingItem(false);
      setNewItemName("");
      setNewItemPrice("");
      setNewItemDescription("");
      setNewItemImage(null);
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
    setEditItemDescription(item.description || "");
    setEditItemImage(null);
  };

  const saveEditedItem = async (id: string, currentImageUrl: string | null) => {
    if (!editItemName.trim() || !editItemPrice) return;
    setIsUploading(true);

    let imageUrl = currentImageUrl;
    if (editItemImage) {
      const newUrl = await uploadImage(editItemImage);
      if (newUrl) imageUrl = newUrl;
    }

    const { error } = await supabase
      .from("menu_items")
      .update({
        name: editItemName,
        price: Number(editItemPrice),
        description: editItemDescription,
        image_url: imageUrl
      })
      .eq("id", id);

    setIsUploading(false);

    if (error) {
      alert("Failed to update menu item.");
    } else {
      setMenuItems(menuItems.map(item => 
        item.id === id ? { ...item, name: editItemName, price: Number(editItemPrice), description: editItemDescription, image_url: imageUrl } : item
      ));
      setEditingItemId(null);
      setEditItemImage(null);
    }
  };

  if (loading || !user || isLoadingCarts) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 pt-24 pb-32 relative overflow-hidden bg-slate-50">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center md:text-left mb-8">
            <Skeleton className="h-10 w-64 mb-2 mx-auto md:mx-0" />
            <Skeleton className="h-5 w-80 mx-auto md:mx-0" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-md flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <NavBar />
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
              <EmptyState 
                icon={Store}
                title="No Food Carts Yet"
                description="You haven't created any food carts. Get started by creating your first cart!"
                action={
                  <button
                    onClick={() => setView('create')}
                    className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <Plus size={18} /> Create Food Cart
                  </button>
                }
              />
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
                          className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 font-semibold text-xs transition-all flex items-center justify-center gap-1 z-10"
                        >
                          <Users size={14} /> Staff
                        </button>
                        <button
                          onClick={(e) => handleSelectSalesInsights(e, cart)}
                          className="flex-1 py-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100 font-semibold text-xs transition-all flex items-center justify-center gap-1 z-10"
                        >
                          <Star size={14} /> Insights
                        </button>
                        <button
                          onClick={(e) => handleSelectCartSettings(e, cart)}
                          className="flex-1 py-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 font-semibold text-xs transition-all flex items-center justify-center gap-1 z-10"
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
                      type="text"
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
                        type="text"
                        value={facebookLink}
                        onChange={(e) => setFacebookLink(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1"><Camera size={14} className="text-pink-500"/> Instagram</label>
                      <input
                        type="text"
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
                          <p className="font-bold text-foreground flex items-center gap-2">
                            {emp?.full_name || "Unknown User"}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                              ID: {emp?.id?.substring(0, 8)}
                            </span>
                            {emp?.phone_number && (
                              <span className="flex items-center gap-1 text-slate-600">
                                <Phone size={12} /> {emp.phone_number}
                              </span>
                            )}
                          </div>
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
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4 flex flex-col gap-3">
                  <div className="flex flex-col md:flex-row gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      className="flex-1 w-full md:w-auto px-3 py-2 rounded-lg bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="number"
                      placeholder="Price (৳)"
                      value={newItemPrice}
                      onChange={e => setNewItemPrice(e.target.value)}
                      className="w-full md:w-32 px-3 py-2 rounded-lg bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <label className="cursor-pointer w-full md:w-auto px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                      <ImageIcon size={16} className={newItemImage ? "text-primary" : "text-slate-400"} />
                      <span className="truncate max-w-[100px]">{newItemImage ? newItemImage.name : "Add Photo"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={e => e.target.files && setNewItemImage(e.target.files[0])} 
                      />
                    </label>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={saveNewItem} disabled={isUploading} className="flex-1 md:flex-none px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : null} Save
                      </button>
                      <button onClick={() => setIsAddingItem(false)} disabled={isUploading} className="flex-1 md:flex-none px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 disabled:opacity-50">Cancel</button>
                    </div>
                  </div>
                  <textarea
                    placeholder="Food description (optional)"
                    value={newItemDescription}
                    onChange={e => setNewItemDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              )}

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {menuItems.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/40 p-4 rounded-xl border border-white/40 shadow-sm transition-all hover:bg-white/60 group gap-3">
                    {editingItemId === item.id ? (
                      <div className="flex-1 flex flex-col gap-3 w-full">
                        <div className="flex flex-col md:flex-row gap-3 items-center w-full">
                          <input
                            type="text"
                            value={editItemName}
                            onChange={e => setEditItemName(e.target.value)}
                            className="flex-1 w-full md:w-auto px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <input
                            type="number"
                            value={editItemPrice}
                            onChange={e => setEditItemPrice(e.target.value)}
                            className="w-full md:w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <label className="cursor-pointer w-full md:w-auto px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                            <ImageIcon size={16} className={editItemImage ? "text-primary" : "text-slate-400"} />
                            <span className="truncate max-w-[80px]">{editItemImage ? editItemImage.name : "Change Photo"}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={e => e.target.files && setEditItemImage(e.target.files[0])} 
                            />
                          </label>
                          <div className="flex gap-1 w-full md:w-auto justify-end">
                            <button onClick={() => saveEditedItem(item.id, item.image_url)} disabled={isUploading} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50">
                              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16}/>}
                            </button>
                            <button onClick={() => setEditingItemId(null)} disabled={isUploading} className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50">
                              <X size={16}/>
                            </button>
                          </div>
                        </div>
                        <textarea
                          placeholder="Food description (optional)"
                          value={editItemDescription}
                          onChange={e => setEditItemDescription(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-3">
                        {item.image_url && (
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-base text-foreground">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-slate-500 mb-1 line-clamp-2">{item.description}</p>
                          )}
                          <p className="text-sm text-muted-foreground">৳ {item.price}</p>
                        </div>
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

        {view === 'sales_insights' && (
          <motion.div
            key="sales_insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto space-y-6"
          >
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="mb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Sales & Insights</h1>
              <p className="text-muted-foreground">Log your revenue by location and let AI optimize your strategy for {cartName}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Logging Sales */}
              <div className="glass-panel p-6 rounded-[2rem] border border-white/60 shadow-lg h-fit">
                <h2 className="text-xl font-bold text-foreground mb-4">Log Sale Session</h2>
                <form onSubmit={handleAddSaleLog} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground ml-1">Revenue Amount (৳)</label>
                    <input
                      type="number"
                      required
                      value={saleAmount}
                      onChange={(e) => setSaleAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground ml-1">Location Name</label>
                    <input
                      type="text"
                      required
                      value={saleLocationName}
                      onChange={(e) => setSaleLocationName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="e.g. Dhanmondi Lake"
                    />
                  </div>
                  <div className="space-y-1.5 mb-2">
                    <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-1"><Navigation size={14}/> Coordinates</label>
                    <p className="text-xs text-muted-foreground mb-2">Pinpoint exactly where this sale occurred.</p>
                    <LocationUpdater 
                      initialLat={saleLat === "" ? null : saleLat} 
                      initialLng={saleLng === "" ? null : saleLng} 
                      onSave={(lat, lng) => { setSaleLat(lat); setSaleLng(lng); return Promise.resolve(); }} 
                      isSaving={false} 
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Log Sale
                  </button>
                </form>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-foreground mb-3">Recent Logs</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {salesLogs.map(log => (
                      <div key={log.id} className="bg-white/50 p-3 rounded-xl border border-white/60 text-sm">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>৳{log.amount}</span>
                          <span>{log.location_name}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {salesLogs.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No sales logged yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Insights */}
              <div className="glass-panel p-6 rounded-[2rem] border border-white/60 shadow-lg h-fit bg-gradient-to-br from-indigo-50/40 to-purple-50/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <h2 className="text-xl font-bold text-indigo-950">AI Profitability Analysis</h2>
                </div>
                
                <p className="text-sm text-slate-600 mb-6">
                  Our AI analyzes your sales logs, locations, and timestamps to find out exactly where and when your cart is most profitable.
                </p>

                {(() => {
                  if (!aiSalesInsight) {
                    return (
                      <div className="bg-white/40 border border-white/60 p-6 rounded-xl text-center mb-6">
                        <p className="text-sm text-slate-500 italic">No insight generated yet.</p>
                      </div>
                    );
                  }
                  
                  try {
                    // Try parsing as JSON
                    const parsed = JSON.parse(aiSalesInsight);
                    return (
                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-white/70 p-4 rounded-xl border border-green-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 text-green-100 opacity-20 -mr-2 -mt-2"><TrendingUp size={64} /></div>
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1"><Award size={12}/> Top Location</span>
                            <span className="text-sm font-bold text-slate-800 z-10">{parsed.top_location?.name || "N/A"}</span>
                            <span className="text-xs text-green-700 font-semibold z-10">{parsed.top_location?.revenue || ""}</span>
                          </div>
                          
                          <div className="bg-white/70 p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 text-blue-100 opacity-20 -mr-2 -mt-2"><TrendingUp size={64} /></div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Secondary</span>
                            <span className="text-sm font-bold text-slate-800 z-10">{parsed.secondary_location?.name || "N/A"}</span>
                            <span className="text-xs text-blue-700 font-semibold z-10">{parsed.secondary_location?.revenue || ""}</span>
                          </div>
                          
                          <div className="bg-white/70 p-4 rounded-xl border border-red-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 text-red-100 opacity-20 -mr-2 -mt-2"><TrendingDown size={64} /></div>
                            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Weakest</span>
                            <span className="text-sm font-bold text-slate-800 z-10">{parsed.weakest_location?.name || "N/A"}</span>
                            <span className="text-xs text-red-700 font-semibold z-10">{parsed.weakest_location?.revenue || ""}</span>
                          </div>
                          
                          <div className="bg-white/70 p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 text-amber-100 opacity-20 -mr-2 -mt-2"><Clock size={64} /></div>
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Best Time</span>
                            <span className="text-sm font-bold text-slate-800 z-10">{parsed.best_time || "N/A"}</span>
                          </div>
                        </div>
                        
                        <div className="bg-indigo-50/80 p-4 rounded-xl border border-indigo-200 shadow-sm">
                          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 block">Recommendation</span>
                          <p className="text-sm text-slate-800 leading-relaxed">{parsed.recommendation}</p>
                        </div>
                      </div>
                    );
                  } catch (e) {
                    // Fallback if not JSON
                    return (
                      <div className="bg-white/60 p-4 rounded-xl border border-indigo-100/50 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap mb-6">
                        {aiSalesInsight}
                      </div>
                    );
                  }
                })()}

                <button
                  onClick={generateAIInsight}
                  disabled={isGeneratingInsight || salesLogs.length === 0}
                  className="w-full py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingInsight ? <Loader2 size={18} className="animate-spin" /> : <Star size={18} />}
                  {isGeneratingInsight ? "Analyzing..." : "Generate AI Insight"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
