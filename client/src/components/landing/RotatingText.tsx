"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const WORDS = ["Research", "Plan", "Recommend"];

export function RotatingText() {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length);
        setIsTransitioning(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-grid place-items-center relative h-[1.3em] align-text-bottom mx-2">
       {/* Invisible spacer to set width to current word */}
       <span className="opacity-0 font-bold text-2xl md:text-3xl px-1 select-none pointer-events-none">
           {WORDS[index]}
       </span>

        <div className="absolute inset-0 flex items-center justify-center">
            <span
                className={cn(
                "text-2xl md:text-3xl text-primary font-bold transition-all duration-500 block",
                isTransitioning ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
                )}
                style={{
                    transform: isTransitioning ? 'translateY(100%)' : 'translateY(0)',
                    opacity: isTransitioning ? 0 : 1
                }}
            >
                {WORDS[index]}
            </span>
        </div>
    </div>
  );
}
