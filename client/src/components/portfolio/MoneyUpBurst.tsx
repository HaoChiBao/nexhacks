"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MoneyUpBurstProps {
  amount: number;
  x: number;
  y: number;
  onDone: () => void;
}

export function MoneyUpBurst({ amount, x, y, onDone }: MoneyUpBurstProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={{ opacity: 1, scale: 1.2, y: -100 }}
        exit={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ left: x, top: y }}
        className="fixed z-50 pointer-events-none flex flex-col items-center"
      >
        <div className="text-4xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
          +{amount} PM
        </div>
        <div className="text-sm text-green-200 mt-1 uppercase tracking-widest font-bold">
          Win Detected
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
