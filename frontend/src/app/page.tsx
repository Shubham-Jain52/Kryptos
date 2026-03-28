"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { SearchBar } from "@/components/SearchBar";
import { VectorGrid } from "@/components/VectorGrid";
import { EnclaveTerminal } from "@/components/EnclaveTerminal";
import { SuccessView } from "@/components/SuccessView";
import { ShimmerGrid } from "@/components/ShimmerCard";
import { searchVectors, startTraining, type SearchResult } from "@/lib/api";

type AppState = 'IDLE' | 'SEARCHING' | 'RESULTS' | 'TRAINING' | 'SUCCESS';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [trainingId, setTrainingId] = useState<string | undefined>();

  const handleSearch = async (query: string) => {
    setResults([]);        // Clear old cards — triggers re-animation on new data
    setAppState('SEARCHING');
    try {
      const data = await searchVectors(query);
      setResults(data);
      setAppState('RESULTS');
    } catch (err) {
      toast.error("Network unreachable — using simulated results.", {
        description: "The backend gateway at localhost:8080 is not responding.",
      });
      // Graceful fallback: show simulated results so the UI still works
      setResults([
        { id: "Case 8842-Alpha", matchScore: "98% MATCH", hospital: "Hospital B", scanType: "MRI", department: "Cardiology", lastAccessed: "2h ago" },
        { id: "Case 7731-Bravo", matchScore: "91% MATCH", hospital: "Hospital A", scanType: "CT Scan", department: "Neurology", lastAccessed: "5h ago" },
        { id: "Case 5519-Delta", matchScore: "87% MATCH", hospital: "Hospital C", scanType: "X-Ray", department: "Orthopedics", lastAccessed: "1d ago" },
      ]);
      setAppState('RESULTS');
    }
  };

  const handleInitializeTraining = async () => {
    try {
      const vectorIds = results.map(r => r.id);
      const status = await startTraining(vectorIds);
      setTrainingId(status.id);
    } catch {
      toast.error("Training init failed — running in simulation mode.");
      setTrainingId(undefined);
    }
    setAppState('TRAINING');
  };

  const handleTrainingComplete = () => {
    setAppState('SUCCESS');
  };

  const isTraining = appState === 'TRAINING';

  return (
    <main className="flex-1 flex flex-col relative z-20">
      <div className="flex-1 pb-32 pt-24">

        {/* SearchBar — dims and blurs during Training (The Vault effect) */}
        <motion.div
          animate={{
            scale: isTraining ? 0.97 : 1,
            opacity: isTraining ? 0.3 : 1,
            filter: isTraining ? "blur(4px)" : "blur(0px)",
          }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="container mx-auto px-4"
        >
          <SearchBar state={appState} onSearch={handleSearch} />
        </motion.div>

        <AnimatePresence mode="wait">
          {appState === 'SEARCHING' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <ShimmerGrid />
            </motion.div>
          )}

          {appState === 'RESULTS' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
            >
              <VectorGrid results={results} onInitialize={handleInitializeTraining} />
            </motion.div>
          )}

          {appState === 'TRAINING' && (
            <EnclaveTerminal key="training" trainingId={trainingId} onComplete={handleTrainingComplete} />
          )}

          {appState === 'SUCCESS' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <SuccessView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
