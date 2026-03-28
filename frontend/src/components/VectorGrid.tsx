"use client";

import { motion, Variants } from "framer-motion";
import { Activity, Brain, Bone, Stethoscope, ArrowRight, SearchX, LucideIcon } from "lucide-react";
import type { SearchResult } from "@/lib/api";

interface VectorGridProps {
  results: SearchResult[];
  onInitialize: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  "MRI": Brain,
  "CT Scan": Activity,
  "X-Ray": Bone,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: -10 },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

export function VectorGrid({ results, onInitialize }: VectorGridProps) {
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-3xl mx-auto mt-20 px-8 text-center pb-20"
      >
        <div className="glass-panel rounded-[2.5rem] p-16 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
            <SearchX className="w-10 h-10 text-on-surface-variant opacity-40" />
          </div>
          <h3 className="text-2xl font-bold text-white font-headline tracking-tight">No Clinical Matches Found</h3>
          <p className="text-sm text-on-surface-variant font-sans font-light opacity-60 max-w-md">
            No matching vectors were discovered in the global anonymized network. Try refining your search query or broadening the clinical parameters.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-7xl mx-auto mt-20 px-8 space-y-8 pb-20"
    >
      {/* Section Header */}
      <motion.div variants={cardVariants} className="flex justify-between items-end">
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-white font-headline tracking-tight">Recent Matched Records</h3>
          <p className="text-sm text-on-surface-variant font-sans opacity-60 font-light">
            {results.length} result{results.length !== 1 ? 's' : ''} — Real-time cryptographic verification active
          </p>
        </div>
        <button className="text-white text-[10px] font-black flex items-center gap-2 hover:opacity-70 font-sans uppercase tracking-[0.2em] transition-opacity">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Cards Grid — each card decrypts in */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {results.map((data) => {
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
              className="bg-[#201f1f] border border-white/[0.03] p-10 rounded-[2rem] relative overflow-hidden cursor-pointer shadow-xl"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5">
                  <Icon className="w-8 h-8 text-[#ffb4a1]" />
                </div>
                <div className="flex items-center gap-2 bg-[#ffb4a1]/10 px-3 py-1.5 rounded-full border border-[#ffb4a1]/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb4a1] animate-pulse" />
                  <span className="text-[10px] font-black text-[#ffb4a1] uppercase tracking-widest leading-none">{data.matchScore}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-white font-headline tracking-tight">{data.id}</h4>
                <div className="flex items-center gap-2 text-on-surface-variant font-sans text-xs font-light opacity-80">
                  <Icon className="w-3.5 h-3.5 opacity-50" />
                  <span>{data.hospital} · {data.department}</span>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/[0.05] flex justify-between items-center font-sans">
                <span className="text-[10px] text-on-surface-variant uppercase font-black tracking-[0.2em] opacity-40 leading-none">
                  {data.scanType} · {data.lastAccessed}
                </span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant opacity-40 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Initialize Button */}
      <motion.div variants={cardVariants} className="flex justify-center pt-6">
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
