"use client";

import { motion } from "framer-motion";

const shimmerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

export function ShimmerCard() {
  return (
    <motion.div
      variants={shimmerVariants}
      className="bg-[#201f1f] border border-white/[0.03] p-10 rounded-[2rem] relative overflow-hidden shadow-xl"
    >
      {/* Shimmer sweep overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </div>

      {/* Icon placeholder */}
      <div className="flex justify-between items-start mb-10">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] animate-pulse" />
        <div className="w-24 h-6 rounded-full bg-white/[0.04] animate-pulse" />
      </div>

      {/* Text placeholders */}
      <div className="space-y-3">
        <div className="h-7 w-48 rounded-lg bg-white/[0.06] animate-pulse" />
        <div className="h-4 w-32 rounded-lg bg-white/[0.04] animate-pulse" />
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-white/[0.05] flex justify-between items-center">
        <div className="h-3 w-28 rounded-full bg-white/[0.04] animate-pulse" />
        <div className="w-4 h-4 rounded bg-white/[0.04] animate-pulse" />
      </div>
    </motion.div>
  );
}

export function ShimmerGrid() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto mt-20 px-8 space-y-8 pb-20"
    >
      {/* Header shimmer */}
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-8 w-64 rounded-lg bg-white/[0.06] animate-pulse" />
          <div className="h-4 w-48 rounded-lg bg-white/[0.04] animate-pulse" />
        </div>
      </div>

      {/* Card grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        <ShimmerCard />
        <ShimmerCard />
        <ShimmerCard />
      </motion.div>
    </motion.div>
  );
}
