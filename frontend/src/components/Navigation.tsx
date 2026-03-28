"use client";

import { User, Bell, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-transparent py-5 px-12 border-b border-white/[0.04] backdrop-blur-[32px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button
            onClick={onMenuClick}
            className="text-white/60 p-2 hover:bg-white/5 hover:text-white rounded-full transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <nav className="flex items-center gap-10 font-sans">
            <Link
              href="/"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all py-1 border-b-2 ${
                pathname === "/"
                  ? "border-[#fd582d] text-white"
                  : "border-transparent text-[#CED0CE]/50 hover:text-white"
              }`}
            >
              Model Training
            </Link>
            <Link
              href="/ingest"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all py-1 border-b-2 ${
                pathname === "/ingest"
                  ? "border-[#fd582d] text-white"
                  : "border-transparent text-[#CED0CE]/50 hover:text-white"
              }`}
            >
              Data Ingestion
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-10">
          <button className="text-[#CED0CE]/50 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#fd582d] rounded-full border-2 border-[#0e0e0e]"></div>
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right leading-tight">
              <p className="text-sm font-bold text-white font-headline">Dr. Aris Thorne</p>
              <p className="text-[10px] text-[#CED0CE]/50 font-sans uppercase tracking-widest">Senior Analyst</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-white/40" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
