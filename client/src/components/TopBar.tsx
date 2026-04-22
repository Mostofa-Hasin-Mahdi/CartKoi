"use client";

import { MapPin, User } from "lucide-react";

export default function TopBar() {
  return (
    <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50">
      {/* Location Top Left */}
      <div className="flex items-center gap-1.5 md:gap-2 text-foreground font-medium bg-white/50 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/60 shadow-sm text-xs md:text-sm">
        <MapPin size={16} className="text-primary" />
        <span className="whitespace-nowrap">Uttara, Dhaka</span>
      </div>

      {/* Username Pill Top Right */}
      <div className="flex items-center gap-1.5 md:gap-2 bg-white/50 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/60 shadow-sm">
        <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] md:max-w-none">Mostofa Hasin</span>
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary flex shrink-0 items-center justify-center text-primary-foreground">
          <User size={12} />
        </div>
      </div>
    </div>
  );
}
