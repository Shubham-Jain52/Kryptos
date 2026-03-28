"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, ShieldCheck, FileText, Info } from "lucide-react";

export function SuccessView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto mt-20 px-4 text-center pb-20"
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
        className="inline-flex items-center justify-center w-32 h-32 bg-primary-flame/10 border border-primary-flame/30 rounded-full mb-10 shadow-2xl shadow-primary-flame/20"
      >
        <CheckCircle2 className="w-16 h-16 text-primary-flame" />
      </motion.div>

      <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight font-headline text-white">Security Protocol Complete</h1>
      <p className="text-on-surface-variant mb-12 text-lg font-light font-sans max-w-xl mx-auto">
        Your diagnostic model has been successfully distilled within the monolithic vault.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="glass-panel p-10 rounded-3xl flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-4 font-black">Model Accuracy</span>
          <span className="text-5xl font-bold font-headline text-white">94.2%</span>
        </div>
        <div className="glass-panel p-10 rounded-3xl flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-4 font-black">Data Leakage</span>
          <span className="text-5xl font-bold font-headline text-primary-flame">0.00%</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-6 bg-secondary-grey text-background-base rounded-full font-black flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_48px_rgba(197,199,197,0.3)] text-xs uppercase tracking-[0.3em] mb-12 border border-white/10"
      >
        <Download className="w-5 h-5" />
        Export Secure Model Weights (.pkl)
      </motion.button>

      <div className="glass-panel border-white/5 p-6 rounded-2xl flex items-start gap-4 text-left max-w-lg mx-auto backdrop-blur-3xl bg-white/[0.02]">
        <div className="bg-primary-flame/10 p-2 rounded-lg mt-1 border border-primary-flame/20 text-primary-flame">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-primary-flame uppercase tracking-[0.3em] mb-2 leading-none">Cryptographic Audit Receipt</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed font-mono opacity-60">
            Trained securely on 1,402 anonymized vectors. Enclave attestation hash: 0x932f...ab1
          </p>
        </div>
      </div>
    </motion.div>
  );
}
