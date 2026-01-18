"use client";

import { LayoutDashboard, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioModeToggleProps {
  mode: "analytics" | "strategy";
  onChange: (mode: "analytics" | "strategy") => void;
}

export function PortfolioModeToggle({ mode, onChange }: PortfolioModeToggleProps) {
  return (
    <div className="flex bg-surface-dark border border-border-dark p-1 rounded-lg">
      <button
        onClick={() => onChange("analytics")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all",
          mode === "analytics"
            ? "bg-gray-700 text-white shadow-sm"
            : "text-gray-400 hover:text-gray-200"
        )}
      >
        <LayoutDashboard className="w-4 h-4" />
        Analytics
      </button>
      <button
        onClick={() => onChange("strategy")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all",
          mode === "strategy"
            ? "bg-emerald-900/40 text-emerald-400 border border-emerald-900/50 shadow-sm"
            : "text-gray-400 hover:text-gray-200"
        )}
      >
        <MapIcon className="w-4 h-4" />
        Strategy Map
      </button>
    </div>
  );
}
