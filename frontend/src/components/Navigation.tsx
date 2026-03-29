"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-transparent py-5 px-12 border-b border-white/[0.04] backdrop-blur-[32px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10">

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
          {/* Notifications and Profile removed for cleaner UI */}
        </div>
      </div>
    </header>
  );
}
