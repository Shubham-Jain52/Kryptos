"use client";

import { motion } from "framer-motion";

export function VitalSignal() {
  // EKG Path: Flat -> P-wave -> QRS Spike -> T-wave -> Flat
  // Scaled for a 400px wide repeating unit with taller spikes
  const pathData =
    "M 0 100 L 80 100 Q 95 85 110 100 L 130 100 L 136 115 L 150 20 L 164 180 L 170 100 L 220 100 Q 250 70 280 100 L 310 100 L 400 100";

  return (
    <div className="fixed inset-0 flex items-center pointer-events-none z-[-2] overflow-hidden opacity-25">
      {/* Single row that stretches full width */}
      <motion.div
        className="absolute left-0 flex flex-nowrap whitespace-nowrap"
        style={{ width: "200%" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Enough SVG tiles to fill 200% viewport width */}
        {[...Array(16)].map((_, i) => (
          <svg
            key={i}
            width="400"
            height="200"
            viewBox="0 0 400 200"
            className="shrink-0"
            preserveAspectRatio="none"
          >
            <path
              d={pathData}
              fill="none"
              stroke="#F15025"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 0 6px rgba(241, 80, 37, 0.6))",
              }}
            />
          </svg>
        ))}
      </motion.div>
    </div>
  );
}
