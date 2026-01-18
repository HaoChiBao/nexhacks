"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MoneyUpBurstProps {
  amount?: number;
  trigger: boolean;
  onComplete?: () => void;
  className?: string;
}

export function MoneyUpBurst({ amount = 100, trigger, onComplete, className }: MoneyUpBurstProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!visible) return null;

  return (
    <div 
      className={cn(
        "absolute pointer-events-none z-50 flex flex-col items-center animate-out fade-out duration-1000 fill-mode-forwards",
        className
      )}
      style={{ animationDelay: "1s" }} // Fade out after 1s
    >
      <div className="animate-in slide-in-from-bottom-10 fade-in duration-700 flex items-center gap-1">
        <span className="text-emerald-400 font-bold text-lg drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
            +{amount.toFixed(0)} PM
        </span>
      </div>
    </div>
  );
}
