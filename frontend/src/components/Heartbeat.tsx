"use client";

import { motion } from "framer-motion";

export function Heartbeat() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[-2]">
      {/* Primary Pulse Ring (Blazing Flame) */}
      <motion.div
        className="absolute rounded-full border border-[#F15025]"
        initial={{ width: 200, height: 200 }}
        animate={{
          scale: [1, 1.4, 1, 1.3, 1],
          opacity: [0, 0.12, 0, 0.08, 0],
        }}
        transition={{
          times: [0, 0.05, 0.1, 0.15, 1],
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Outer Echo Ring (Alabaster Grey) */}
      <motion.div
        className="absolute rounded-full border border-[#E6E8E6]"
        initial={{ width: 240, height: 240 }}
        animate={{
          scale: [1, 1.8, 1, 1.6, 1],
          opacity: [0, 0.08, 0, 0.05, 0],
        }}
        transition={{
          times: [0, 0.05, 0.1, 0.15, 1],
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.1,
        }}
      />
      
      {/* Tertiary Deep Pulse (Slow wave) */}
       <motion.div
        className="absolute rounded-full border border-[#F15025]"
        initial={{ width: 180, height: 180 }}
        animate={{
          scale: [1, 4],
          opacity: [0.05, 0],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </div>
  );
}
