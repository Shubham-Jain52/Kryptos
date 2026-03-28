"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Beaker, 
  Users, 
  TrendingUp, 
  Settings as SettingsIcon, 
  Plus,
  Zap,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed flex flex-col h-screen w-80 bg-[#131313] py-8 px-8 border-r border-white/[0.08] z-[70] shadow-2xl"
          >
            <div className="flex justify-between items-start mb-14">
              <div className="px-2">
                <h1 className="text-2xl font-bold text-[#ffb4a1] tracking-tight font-headline">Kryptos AI</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#e4beb5] opacity-60 font-sans font-bold">Medical Intelligence</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-3 font-sans">
              <Link 
                href="/" 
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  pathname === '/' 
                    ? "text-white border-l-2 border-[#fd582d] bg-white/5 shadow-[inset_10px_0_15px_-10px_rgba(253,88,45,0.2)]" 
                    : "text-[#CED0CE]/50 hover:text-white hover:bg-white/10"
                }`}
              >
                <Beaker className={`w-5 h-5 ${pathname === '/' ? "text-[#fd582d]" : ""}`} />
                <span className="text-sm font-semibold uppercase tracking-widest">Diagnostics</span>
              </Link>
              <Link 
                href="#" 
                className="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-[#CED0CE]/50 hover:text-white hover:bg-white/10"
              >
                <TrendingUp className="w-5 h-5 opacity-40" />
                <span className="text-sm font-semibold uppercase tracking-widest">Analytics</span>
              </Link>
              <Link 
                href="#" 
                className="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-[#CED0CE]/50 hover:text-white hover:bg-white/10"
              >
                <SettingsIcon className="w-5 h-5 opacity-40" />
                <span className="text-sm font-semibold uppercase tracking-widest">Settings</span>
              </Link>

              <div className="pt-8 px-1">
                <button className="w-full bg-[#fd582d] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_8px_32px_rgba(253,88,45,0.3)] group">
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  <span className="text-[10px] uppercase tracking-[0.2em]">New Analysis</span>
                </button>
              </div>
            </nav>

            <div className="mt-auto pt-10 px-2">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#fd582d]/10 flex items-center justify-center">
                       <Zap className="w-5 h-5 text-[#fd582d]" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Pro System</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-[#fd582d] rounded-full" />
                 </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
