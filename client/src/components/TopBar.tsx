"use client";

import Link from "next/link";
import { MapPin, User } from "lucide-react";

export default function TopBar() {
  return (
    <div className="absolute top-0 left-0 w-full p-4 md:p-6 grid grid-cols-3 items-center z-50 gap-2">
      {/* Location Top Left */}
      <div className="justify-self-start flex items-center gap-1.5 md:gap-2 text-white font-medium bg-slate-950 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-800 shadow-sm text-xs md:text-sm">
        <MapPin size={16} className="text-primary shrink-0" />
        {/* Hide text on very small screens to prevent overlap, show on sm and up */}
        <span className="hidden sm:inline whitespace-nowrap">Uttara, Dhaka</span>
      </div>

      {/* Center Logo */}
      <div className="justify-self-center">
        {/* We use a glass pill for the logo so it stands out from the background while keeping the soft theme */}
        <Link href="/" className="text-lg md:text-2xl font-black text-foreground tracking-tight bg-white/60 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white/60 shadow-sm whitespace-nowrap flex items-center">
          Cart<span className="text-primary">Koi</span>
        </Link>
      </div>

      {/* Username Pill Top Right */}
      <div className="justify-self-end flex items-center gap-1.5 md:gap-2 bg-slate-950 px-1.5 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-800 shadow-sm">
        {/* Hide text on very small screens */}
        <span className="text-xs md:text-sm font-semibold text-white whitespace-nowrap hidden sm:inline px-2">Mostofa Hasin</span>
        <div className="w-7 h-7 md:w-6 md:h-6 rounded-full bg-primary flex shrink-0 items-center justify-center text-primary-foreground">
          <User size={14} className="md:w-[12px] md:h-[12px]" />
        </div>
      </div>
    </div>
  );
}
