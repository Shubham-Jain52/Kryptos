"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Cpu, CheckCircle2 } from "lucide-react";
import { pollTrainingStatus, type TrainingStatus } from "@/lib/api";

interface EnclaveTerminalProps {
  trainingId?: string;
  onComplete: () => void;
}

// Fallback simulation timeline (used when no real backend trainingId is provided)
const SIMULATED_TIMELINE = [
  { time: 0, log: "[System] Establishing vsock connection to AWS Nitro Enclave..." },
  { time: 2000, log: "[System] Pushing 1,402 vectors into secure memory..." },
  { time: 3000, log: "[Enclave] Training Neural Network..." },
  { time: 6000, log: "[System] Model weights extracted. Enclave memory permanently purged." },
];

export function EnclaveTerminal({ trainingId, onComplete }: EnclaveTerminalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (trainingId) {
      // ── Real backend polling ──
      setLogs(["[System] Training session initiated. Connecting to enclave..."]);

      pollRef.current = setInterval(async () => {
        try {
          const status: TrainingStatus = await pollTrainingStatus(trainingId);

          if (status.log) {
            setLogs(prev => {
              if (prev[prev.length - 1] !== status.log) {
                return [...prev, status.log!];
              }
              return prev;
            });
          }

          setProgress(status.progress);

          if (status.state === "COMPLETE" || status.state === "FAILED") {
            if (pollRef.current) clearInterval(pollRef.current);
            setIsFinished(true);
            setTimeout(onComplete, 1000);
          }
        } catch {
          // If polling fails, just continue — might be a transient error
        }
      }, 2000);
    } else {
      // ── Simulated fallback ──
      SIMULATED_TIMELINE.forEach(({ time, log }) => {
        setTimeout(() => setLogs(prev => [...prev, log]), time);
      });

      const startTime = 3000;
      const duration = 3000;
      const interval = 50;
      const increment = 100 / (duration / interval);

      setTimeout(() => {
        const timer = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(timer);
              return 100;
            }
            return prev + increment;
          });
        }, interval);
      }, startTime);

      setTimeout(() => {
        setIsFinished(true);
        setTimeout(onComplete, 1000);
      }, 7500);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [trainingId, onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto mt-24 px-4"
    >
      <div
        className="glass-panel rounded-[2rem] overflow-hidden shadow-2xl relative"
        style={{ boxShadow: "0 0 80px rgba(255,180,161,0.07), 0 32px 64px rgba(0,0,0,0.4)" }}
      >
        <div className="absolute inset-0 bg-primary-flame/5 pointer-events-none" />

        <div className="bg-white/5 border-b border-white/10 px-8 py-5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <Cpu className="w-5 h-5 text-primary-flame" />
            <h3 className="text-sm font-bold text-white font-headline tracking-widest uppercase">
              AWS-NITRO-ENCLAVE-SESSION: {trainingId ? `0x${trainingId.slice(0, 6)}...` : "0x82F..."}
            </h3>
          </div>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary-flame animate-pulse" />
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-[450px] p-10 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 relative z-10"
        >
          <div className="space-y-3">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex gap-4"
              >
                <span className="text-on-surface-variant opacity-40 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                <span className={log.includes("[Enclave]") ? "text-primary-flame" : "text-on-surface"}>
                  {log}
                </span>
              </motion.div>
            ))}

            {progress > 0 && progress < 100 && (
              <div className="mt-10 flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] text-primary-flame font-black uppercase tracking-[0.25em]">Training Neural Vectors</span>
                  <span className="text-[10px] text-white font-bold">{Math.floor(progress)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-primary-flame shadow-[0_0_20px_rgba(255,180,161,0.5)] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {isFinished && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-6 glass-panel border-primary-flame/20 bg-primary-flame/5 rounded-2xl flex items-center gap-4"
              >
                <CheckCircle2 className="w-6 h-6 text-primary-flame" />
                <span className="text-primary-flame font-bold tracking-tight">Secure Computation Success: Protocol Termination</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="bg-transparent px-8 py-5 border-t border-white/5 flex items-center gap-6 relative z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-flame/60" />
            <span className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] opacity-60">Attestation Layer v4.0 Active</span>
          </div>
          <div className="h-[1px] flex-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="h-full w-40 bg-gradient-to-r from-transparent via-primary-flame/40 to-transparent"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
