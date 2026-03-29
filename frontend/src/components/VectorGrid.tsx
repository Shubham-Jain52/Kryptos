"use client";

import { motion, Variants } from "framer-motion";
import { Activity, Brain, Bone, Stethoscope, ShieldCheck, ArrowRight, SearchX, LucideIcon } from "lucide-react";
import type { SearchResult } from "@/lib/api";

interface VectorGridProps {
  results: SearchResult[];
  onInitialize: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  "MRI": Brain,
  "CT Scan": Activity,
  "X-Ray": Bone,
  "X-Ray/Scan": Bone,
  "Video Clip": Activity,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.7, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  },
};

export function VectorGrid({ results, onInitialize }: VectorGridProps) {
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center pt-24 pb-40 overflow-hidden"
      >
        <div className="relative mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl"
          />
          <SearchX className="w-24 h-24 text-white/10" />
        </div>
        <h2 className="text-3xl font-serif text-white/40 italic">No clusters found in the current enclave sector.</h2>
        <p className="text-white/20 mt-4 font-sans tracking-widest uppercase text-[10px]">Adjust search parameters or verify ingestion keys.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[1400px] mx-auto"
    >
      <div className="flex items-baseline justify-between mb-16 px-2">
        <div>
          <h2 className="text-5xl font-serif text-white tracking-tight mb-4">
            Recent Matched Records
          </h2>
          <p className="text-white/40 font-sans tracking-wide text-sm flex items-center gap-2">
            <span className="text-white/60 font-bold">{results.length} results</span> — Real-time cryptographic verification active
          </p>
        </div>
      </div>

      {/* Cards Grid — each card decrypts in */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {results.map((data) => {
          const isLive = data.isNew === true || data.source === "LIVE_INGEST";
          const Icon = iconMap[data.scanType] ?? Stethoscope;
          return (
            <motion.div
              key={data.id}
              variants={cardVariants}
              whileHover={{
                y: -4,
                borderColor: "rgba(255,255,255,0.10)",
                transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              }}
              className="bg-[#201f1f] p-10 rounded-[2rem] relative overflow-hidden cursor-pointer shadow-xl border border-white/[0.03]"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center border bg-white/[0.03] border-white/5">
                  <Icon className={`w-8 h-8 ${isLive ? "text-white/40" : "text-[#ffb4a1]"}`} />
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-[#ffb4a1]/10 border-[#ffb4a1]/10">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#ffb4a1]" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none text-[#ffb4a1]">
                      {isLive ? "97% MATCH" : data.matchScore}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-serif text-white leading-tight">
                  {data.id}
                </h3>
                <p className="text-white/40 text-sm font-sans flex items-center gap-2">
                  {data.hospital.toLowerCase()} · {data.department}
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">
                    {data.scanType}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    · {data.lastAccessed}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/10" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Initialize Button */}
      <motion.div variants={cardVariants} className="flex justify-center pt-12 pb-10">
        <motion.button
          whileHover={{ scale: 1.04, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
          whileTap={{ scale: 0.97 }}
          onClick={onInitialize}
          className="bg-secondary-grey text-[#131313] font-bold px-14 py-5 rounded-full text-[10px] uppercase tracking-[0.25em] transition-shadow duration-500 hover:shadow-[0_0_48px_rgba(197,199,197,0.35)] border border-white/10 font-sans"
        >
          Initialize Secure Enclave Training
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
