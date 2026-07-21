"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowLeft, Store, MapPin, ExternalLink, Navigation, Clock, CheckCircle2, XCircle, CalendarDays, Star, MessageSquare, Share2, Globe, Camera, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { formatHoursForDisplay, OperatingHours } from "@/utils/hours";
import NavBar from "@/components/NavBar";
import { calculateDistance } from "@/utils/distance";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [cart, setCart] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    // Check local storage for spam protection
    if (params.id) {
      const reviewed = localStorage.getItem(`has_reviewed_${params.id}`);
      if (reviewed) setHasReviewed(true);
    }
  }, [params.id]);

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

        // Fetch reviews
        const { data: reviewData, error: reviewError } = await supabase
          .from("reviews")
          .select("*")
          .eq("cart_id", params.id)
          .order("created_at", { ascending: false });

        if (reviewError) throw reviewError;
        setReviews(reviewData || []);

      } catch (err) {
        console.error("Error fetching cart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [params.id]);

  // Fetch AI Summary
  useEffect(() => {
    const fetchAISummary = async () => {
      if (!params.id) return;
      setIsLoadingSummary(true);
      try {
        const res = await fetch(`/api/cart/${params.id}/summary`);
        if (res.ok) {
          const data = await res.json();
          setAiSummary(data.summary);
        }
      } catch (err) {
        console.error("Error fetching AI summary:", err);
      } finally {
        setIsLoadingSummary(false);
      }
    };

    fetchAISummary();
  }, [params.id, reviews.length]);

  useEffect(() => {
    if (cart?.lat && cart?.lng) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, cart.lat, cart.lng);
            setDistanceKm(dist);
            setLocationDenied(false);
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              setLocationDenied(true);
            }
          }
        );
      }
    }
  }, [cart?.lat, cart?.lng]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-slate-50 pb-24 relative overflow-x-hidden">
        <div className="w-full h-48 md:h-64 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10" />
        </div>
        <div className="px-4 md:px-8 max-w-4xl mx-auto w-full -mt-16 z-20 relative">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start mb-4">
              <div className="w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="h-10 w-3/4 md:w-1/2" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2 max-w-2xl">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-100 mt-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
          
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border bg-white border-slate-200 shadow-sm gap-2 sm:gap-4">
                <div className="flex items-center gap-4 w-full">
                  <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                  <Skeleton className="h-6 w-1/3 min-w-[120px]" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full mt-1 sm:mt-0" />
              </div>
            ))}
          </div>
        </div>
        <NavBar />
      </main>
    );
  }

  if (!cart) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-white">Cart not found.</p>
      </main>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "New";

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasReviewed || !reviewName.trim() || !params.id) return;
    
    setIsSubmittingReview(true);
    
    const newReview = {
      cart_id: params.id,
      reviewer_name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim() || null
    };

    const { data, error } = await supabase
      .from("reviews")
      .insert(newReview)
      .select()
      .single();

    if (error) {
      alert("Failed to submit review.");
    } else {
      setReviews([data, ...reviews]);
      setHasReviewed(true);
      localStorage.setItem(`has_reviewed_${params.id}`, "true");
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    }
    setIsSubmittingReview(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: cart.name,
      text: `Check out ${cart.name} on CartKoi!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for older browsers
        await navigator.clipboard.writeText(window.location.href);
        alert("Cart link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

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
    <main className="flex min-h-screen flex-col bg-slate-50 pb-24 relative overflow-x-hidden">
      {/* Header section with optional background image placeholder */}
      <div className="w-full h-48 md:h-64 bg-slate-900 relative overflow-hidden">
        {cart.image_url && (
          <Image src={cart.image_url} alt="Cart Background" fill className="object-cover opacity-60 mix-blend-overlay" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
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
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center text-yellow-500">
                  <Star size={18} fill="currentColor" />
                </div>
                <span className="font-bold text-slate-700">{averageRating}</span>
                <span className="text-sm text-slate-400">({reviews.length} reviews)</span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-2xl break-words whitespace-pre-wrap">{cart.description || "No description provided."}</p>
            </div>
            
            {/* Action Buttons & Social Links */}
            <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="flex gap-2 w-full">
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition"
                >
                  <Share2 size={16} /> Share
                </button>
                {cart.lat && cart.lng && (
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${cart.lat},${cart.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition"
                  >
                    <Navigation size={16} /> Directions
                  </a>
                )}
              </div>
              
              {(cart.foodpanda_link || (cart.social_links && (cart.social_links.facebook || cart.social_links.instagram))) && (
                <div className="flex flex-wrap gap-2 w-full">
                  {cart.foodpanda_link && (
                    <a href={cart.foodpanda_link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#D70F64]/10 text-[#D70F64] rounded-xl font-bold text-xs hover:bg-[#D70F64]/20 transition">
                      <ShoppingBag size={14} /> Foodpanda
                    </a>
                  )}
                  {cart.social_links?.facebook && (
                    <a href={cart.social_links.facebook} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-100 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-200 transition">
                      <Globe size={14} /> Facebook
                    </a>
                  )}
                  {cart.social_links?.instagram && (
                    <a href={cart.social_links.instagram} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-pink-100 text-pink-600 rounded-xl font-bold text-xs hover:bg-pink-200 transition">
                      <Camera size={14} /> Instagram
                    </a>
                  )}
                </div>
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
                {distanceKm !== null ? (
                  <span>{distanceKm < 1 ? `${(distanceKm * 1000).toFixed(0)} m away` : `${distanceKm.toFixed(1)} km away`}</span>
                ) : locationDenied ? (
                  <span className="text-slate-400 text-xs italic" title="Location access needed for distance">Access denied</span>
                ) : (
                  <span>{cart.lat ? `${cart.lat.toFixed(4)}, ${cart.lng.toFixed(4)}` : 'Unknown'}</span>
                )}
              </span>
            </div>
          </div>

          {/* Menu Section */}
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            Menu
          </h2>
          
          <div className="space-y-3">
            {menuItems.length > 0 ? menuItems.map(item => (
              <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border gap-2 sm:gap-4 ${item.is_available ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                <div className="flex items-center gap-4">
                  {item.image_url && (
                    <div className="w-16 h-16 relative rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <h3 className={`font-bold text-lg ${item.is_available ? 'text-slate-800' : 'text-slate-500 line-through decoration-slate-400'}`}>
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className={`text-sm mt-1 line-clamp-2 ${item.is_available ? 'text-slate-500' : 'text-slate-400'}`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                  <span className="font-black text-primary text-lg">৳{item.price}</span>
                  {item.is_available ? (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={14}/> In Stock</span>
                  ) : (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1"><XCircle size={14}/> Sold Out</span>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <p className="text-slate-400 font-medium">No menu items added yet.</p>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare size={24} className="text-primary" /> Customer Reviews
            </h2>

            {/* AI Summary Section */}
            {(isLoadingSummary || aiSummary) && (
              <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-indigo-100 p-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-indigo-950 text-lg">AI Review Summary</h3>
                </div>
                
                {isLoadingSummary ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-indigo-200/50 rounded-full w-3/4"></div>
                    <div className="h-4 bg-indigo-200/50 rounded-full w-full"></div>
                    <div className="h-4 bg-indigo-200/50 rounded-full w-5/6"></div>
                  </div>
                ) : (
                  <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {aiSummary}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-800">{review.reviewer_name}</h4>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold">{review.rating}</span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-slate-600 text-sm break-words whitespace-pre-wrap">{review.comment}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-3">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                )) : (
                  <p className="text-slate-500">No reviews yet. Be the first to leave one!</p>
                )}
              </div>

              <div className="md:col-span-1">
                {!hasReviewed ? (
                  <form onSubmit={submitReview} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">Leave a Review</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Your Name</label>
                        <input
                          required
                          type="text"
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. John D."
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className={`p-1 ${reviewRating >= star ? 'text-yellow-500' : 'text-slate-300'}`}
                            >
                              <Star size={24} fill={reviewRating >= star ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Comment (Optional)</label>
                        <textarea
                          value={reviewComment}
                          onChange={e => setReviewComment(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          placeholder="How was the food?"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingReview || !reviewName.trim()}
                        className="w-full py-2.5 bg-primary text-white rounded-xl font-bold shadow-sm hover:bg-primary/90 transition disabled:opacity-50"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center sticky top-24">
                    <CheckCircle2 size={40} className="mx-auto text-green-500 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Thanks for your review!</h3>
                    <p className="text-sm text-slate-600">Your feedback helps others find great food.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <NavBar />
    </main>
  );
}
