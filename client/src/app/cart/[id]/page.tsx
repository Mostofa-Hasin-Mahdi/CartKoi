"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowLeft, Store, MapPin, ExternalLink, Navigation, Clock, CheckCircle2, XCircle, CalendarDays } from "lucide-react";
import { formatHoursForDisplay, OperatingHours } from "@/utils/hours";
import NavBar from "@/components/NavBar";

export default function CartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [cart, setCart] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      if (!params.id) return;
      
      try {
        // Fetch cart details
        const { data: cartData, error: cartError } = await supabase
          .from("carts")
          .select("*")
          .eq("id", params.id)
          .single();

        if (cartError) throw cartError;
        setCart(cartData);

        // Fetch menu items
        const { data: menuData, error: menuError } = await supabase
          .from("menu_items")
          .select("*")
          .eq("cart_id", params.id)
          .order("created_at", { ascending: false });

        if (menuError) throw menuError;
        setMenuItems(menuData || []);

      } catch (err) {
        console.error("Error fetching cart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </main>
    );
  }

  if (!cart) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6">
        <Store size={48} className="text-slate-600 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Cart Not Found</h1>
        <p className="text-slate-400 mb-6">The food cart you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/explore')} className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold">
          Back to Explore
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 pb-24 relative">
      {/* Header section with optional background image placeholder */}
      <div className="w-full h-48 md:h-64 bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
        <button 
          onClick={() => router.push('/explore')}
          className="absolute top-6 left-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-4 md:px-8 max-w-4xl mx-auto w-full -mt-16 z-20 relative">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{cart.name}</h1>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${cart.is_open ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {cart.is_open ? 'Open Now' : 'Closed'}
                </div>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-2xl">{cart.description || "No description provided."}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
              {cart.lat && cart.lng && (
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${cart.lat},${cart.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition"
                >
                  <Navigation size={16} /> Directions
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-100 mt-6 mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Status</span>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Clock size={14} className={cart.is_open ? 'text-green-500' : 'text-slate-400'}/> 
                {cart.is_open ? 'Accepting Orders' : 'Currently Closed'}
              </span>
            </div>
            {cart.operating_hours && (
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Today's Schedule</span>
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <CalendarDays size={14} className="text-blue-500" />
                  {formatHoursForDisplay(cart.operating_hours as OperatingHours).replace('Usually Open: ', '')}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Coordinates</span>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <MapPin size={14} className="text-blue-500" />
                {cart.lat ? `${cart.lat.toFixed(4)}, ${cart.lng.toFixed(4)}` : 'Unknown'}
              </span>
            </div>
          </div>

          {/* Menu Section */}
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            Menu
          </h2>
          
          <div className="space-y-3">
            {menuItems.length > 0 ? menuItems.map(item => (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border ${item.is_available ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                <div>
                  <h3 className={`font-bold text-lg ${item.is_available ? 'text-slate-800' : 'text-slate-500 line-through decoration-slate-400'}`}>
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-primary">৳{item.price}</span>
                    {item.is_available ? (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> In Stock</span>
                    ) : (
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><XCircle size={12}/> Sold Out</span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <p className="text-slate-400 font-medium">No menu items added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <NavBar />
    </main>
  );
}
