"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { Heartbeat } from "./Heartbeat";
import { VitalSignal } from "./VitalSignal";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heartbeat />
      <VitalSignal />

      {/* ── Breathing Aura ── persistent 10-second loop, no bouncing */}
      <div className="fixed inset-0 z-[-3] pointer-events-none overflow-hidden">
        {/* Orange orb — primary flame (#F15025) */}
        <motion.div
          className="absolute rounded-full"
          initial={{ 
            width: 900, 
            height: 900, 
            top: "-20%", 
            left: "-15%",
            background: "radial-gradient(circle, rgba(241,80,37,0.12) 0%, transparent 70%)",
            filter: "blur(80px)" 
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.6, 1, 0.6],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Grey orb — alabaster (#E6E8E6) */}
        <motion.div
          className="absolute rounded-full"
          initial={{ 
            width: 1000, 
            height: 1000, 
            bottom: "-25%", 
            right: "-20%",
            background: "radial-gradient(circle, rgba(230,232,230,0.07) 0%, transparent 70%)",
            filter: "blur(100px)"
          }}
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5, // offset so both orbs breathe out-of-phase
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1 min-h-screen">
        <Navigation />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </>
  );
}
