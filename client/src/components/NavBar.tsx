"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, User, LogIn, LogOut, Store, Home, UserPlus, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAuthPage = pathname === "/owners/login" || pathname === "/owners/signup";

  return (
    <motion.header
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed z-50 flex items-center bg-slate-950 text-white border border-slate-800 shadow-2xl transition-all duration-300 bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[95%] ${isAuthPage ? 'md:w-[380px]' : 'md:w-[520px]'} h-[64px] md:h-[68px] rounded-full px-4 md:px-8 justify-around`}
    >
      <nav className="flex items-center w-full justify-around md:justify-center md:gap-8 flex-1">
        {isAuthPage ? (
          <>
            <Link href="/" className="flex flex-col md:flex-row items-center gap-1 text-slate-400 hover:text-white transition-colors">
              <Home size={22} className="md:w-4 md:h-4" /> 
              <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Home</span>
            </Link>
            <Link href="/owners/login" className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${pathname === '/owners/login' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}>
              <LogIn size={22} className="md:w-4 md:h-4" /> 
              <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Sign In</span>
            </Link>
            <Link href="/owners/signup" className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${pathname === '/owners/signup' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}>
              <UserPlus size={22} className="md:w-4 md:h-4" /> 
              <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Sign Up</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/explore" className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${pathname === '/explore' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}>
              <MapPin size={22} className="md:w-4 md:h-4" /> 
              <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Explore</span>
            </Link>
            <Link href="/" className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${pathname === '/' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}>
              <Store size={22} className="md:w-4 md:h-4" /> 
              <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Cart</span>
            </Link>
            
            {/* Show Dashboard if logged in, otherwise "For Owners" CTA */}
            {user ? (
              <Link href={user.role === "employee" ? "/employees/dashboard" : "/owners/dashboard"} className={`flex flex-col md:flex-row items-center gap-1 transition-colors ${pathname.includes('dashboard') ? 'text-primary' : 'text-slate-400 hover:text-white'}`}>
                <LayoutDashboard size={22} className="md:w-4 md:h-4" /> 
                <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Dashboard</span>
              </Link>
            ) : (
              <Link href="/#owners" className="flex flex-col md:flex-row items-center gap-1 text-slate-400 hover:text-white transition-colors">
                <User size={22} className="md:w-4 md:h-4" /> 
                <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">For Owners</span>
              </Link>
            )}

            {/* Mobile Login/Logout Tab */}
            {!user ? (
              <Link href="/owners/login" className="flex md:hidden flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
                <LogIn size={22} /> 
                <span className="text-[10px] font-medium mt-1">Login</span>
              </Link>
            ) : (
              <button onClick={async () => await logout()} className="flex md:hidden flex-col items-center gap-1 text-red-400 hover:text-red-300 transition-colors">
                <LogOut size={22} /> 
                <span className="text-[10px] font-medium mt-1">Logout</span>
              </button>
            )}
          </>
        )}
      </nav>

      {/* Desktop Login/Logout Button */}
      {!isAuthPage && (
        <div className="hidden md:block md:pl-8 md:border-l md:border-slate-800 md:ml-6">
          {!user ? (
            <Link 
              href="/owners/login" 
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <LogIn size={16} /> Login
            </Link>
          ) : (
            <button 
              onClick={async () => {
                await logout();
                // Optionally redirect to home if logging out from dashboard
                if(pathname === '/owners/dashboard') window.location.href = '/';
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-500/20 text-red-500 text-sm font-semibold hover:bg-red-500/30 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      )}
    </motion.header>
  );
}
