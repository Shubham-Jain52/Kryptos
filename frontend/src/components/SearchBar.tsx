"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  state: 'IDLE' | 'SEARCHING' | 'RESULTS' | 'TRAINING' | 'SUCCESS';
  onSearch: (query: string) => void;
}

export function SearchBar({ state, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMini = state === 'RESULTS' || state === 'TRAINING' || state === 'SUCCESS';
  const isSearching = state === 'SEARCHING';

  // ── Debounced autocomplete ──
  useEffect(() => {
    if (query.length < 2 || isMini || isSearching) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSuggesting(true);
      setShowDropdown(true);

      try {
        const res = await fetch("/api/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!res.ok) throw new Error("Autocomplete failed");

        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSuggesting(false);
      }
    }, 300);

    // Cleanup: cancel previous timeout if the user types another letter
    return () => clearTimeout(timer);
  }, [query, isMini, isSearching]);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowDropdown(false);
    setSuggestions([]);
    onSearch(suggestion);
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`w-full max-w-4xl mx-auto z-40 px-4 flex flex-col items-center text-center ${isMini ? "mt-6" : "mt-[15vh]"}`}
    >
      {/* Hero Headline — fades out when isMini */}
      {!isMini && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-6 mb-10"
        >
          <h2 className="text-6xl lg:text-8xl font-bold text-white font-headline tracking-tighter leading-[0.9]">
            Precision Vector <br />
            <span className="text-[#ffb4a1] italic font-normal tracking-tight">Intelligence</span>
          </h2>
          <p className="text-lg text-on-surface-variant font-sans font-light max-w-2xl mx-auto opacity-80">
            Execute semantic analysis across encrypted global healthcare repositories with zero-trust protocols.
          </p>
        </motion.div>
      )}

      {/* Search Input + Autocomplete Dropdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="relative w-full max-w-2xl group mb-8"
        ref={dropdownRef}
      >
        <div className="absolute inset-0 bg-primary-flame/10 blur-3xl rounded-full transition-opacity duration-700 group-focus-within:opacity-100 opacity-0 pointer-events-none" />
        <div className="relative flex items-center bg-white h-16 rounded-full shadow-2xl overflow-hidden border border-white/20">
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none py-4 px-10 text-[#131313] placeholder:text-[#131313]/50 focus:outline-none font-sans text-center text-sm tracking-wide disabled:opacity-50 transition-opacity duration-500"
            placeholder="Search global vector network..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query) {
                setShowDropdown(false);
                onSearch(query);
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            disabled={isSearching || isMini}
          />
        </div>

        {/* Glassmorphic Autocomplete Dropdown */}
        <AnimatePresence>
          {showDropdown && (isSuggesting || suggestions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-full mt-3 w-full bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <ul className="py-2">
                {isSuggesting && suggestions.length === 0 ? (
                  <li className="px-6 py-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-flame animate-pulse" />
                    <span className="text-sm text-on-surface-variant font-sans font-light animate-pulse">
                      Consulting Enclave Network...
                    </span>
                  </li>
                ) : (
                  suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-6 py-3.5 text-sm text-white/80 font-sans font-light hover:bg-white/5 hover:text-white transition-all duration-200 flex items-center gap-3 group/item"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-flame/40 group-hover/item:bg-primary-flame transition-colors" />
                        {suggestion}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CTA Button */}
      {!isMini && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.4 }}
          onClick={() => { setShowDropdown(false); onSearch(query); }}
          disabled={isSearching || !query}
          className="bg-secondary-grey text-[#131313] font-bold px-12 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_48px_rgba(197,199,197,0.4)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Scanning Enclave...
            </span>
          ) : (
            "Scan Secure Enclave"
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
