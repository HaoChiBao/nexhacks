import { useState } from "react";
import { MarketLine } from "@/lib/types/fund-builder";
import { cn } from "@/lib/utils";
import { Info, ExternalLink, Activity, ChevronDown, ChevronUp } from "lucide-react";

interface LineCardProps {
  line: MarketLine;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  weight?: number;
  onWeightChange?: (val: number) => void;
  mode: 'select' | 'weight';
}

export function LineCard({ line, isSelected, onToggleSelect, weight, onWeightChange, mode }: LineCardProps) {
  // Removed state, using CSS hover

  return (
    <div
      className={cn(
        "group relative bg-surface-dark border transition-all duration-300",
        isSelected
          ? "border-emerald-500/50 bg-emerald-900/10 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]"
          : "border-border-dark hover:border-gray-600",
        "rounded-xl hover:z-50" // Lift on hover
      )}
    >
      {/* Header Section */}
      <div className="p-4 flex gap-4">
        {/* Header Section (Restricted Width) */}
        <div className="flex-grow min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-200 leading-snug line-clamp-3">
              {line.slug ? (
                <a
                  href={`https://polymarket.com/event/${line.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 hover:underline transition-colors block"
                >
                  {line.question}
                </a>
              ) : (
                <>{line.question}</>
              )}
            </h4>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 whitespace-nowrap overflow-hidden w-full">
            <span className="flex items-center gap-1 min-w-0 flex-shrink">
              <img src="https://polymarket.com/favicon.ico" alt="poly" className="w-3 h-3 grayscale opacity-60 flex-shrink-0" />
              <span className="truncate">Polymarket</span>
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-600 flex-shrink-0" />
            <span className="font-mono text-gray-400 flex-shrink-0">${((line.marketVolume || 0) / 1000).toFixed(1)}k Vol</span>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-600 flex-shrink-0" />
            <span className={cn(
              "font-bold uppercase flex-shrink-0",
              line.outcome === 'YES' ? "text-emerald-500" :
                line.outcome === 'NO' ? "text-red-500" : "text-blue-400"
            )}>
              {line.outcome || "YES"}
            </span>
            {/* Info Icon Removed */}
          </div>
        </div>

        {/* Action / Value Section (Fixed Width) */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 min-w-[80px]">
          {mode === 'select' && (
            <button
              onClick={onToggleSelect}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                isSelected
                  ? "bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400"
                  : "bg-transparent text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
              )}
            >
              {isSelected ? "Selected" : "Add"}
            </button>
          )}

          {mode === 'weight' && (
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {weight?.toFixed(1)}%
              </div>
              <div className="text-[10px] text-gray-500 uppercase">Weight</div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Popup Content */}
      <div className={cn(
        "absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl px-4 pb-4 pt-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] text-xs text-gray-400 transition-all duration-200 pointer-events-none opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto",
        isSelected
          ? "bg-surface-dark border border-emerald-500/50 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.1)]"
          : "bg-surface-dark border border-gray-700"
      )}>
        {/* Connecting Arrow/Nub (Optional, but adds to popup feel) */}
        <div className={cn(
          "absolute -top-1.5 left-8 w-3 h-3 rotate-45 border-l border-t bg-surface-dark",
          isSelected ? "border-emerald-500/50" : "border-gray-700"
        )} />

        <div className="mb-2 relative z-10">
          <span className="text-gray-500 font-bold uppercase text-[10px]">Reasoning</span>
          <p className="mt-1 leading-relaxed text-gray-300">
            {line.reasoning || "AI analysis based on recent search and market data suggests this outcome."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-800/50 relative z-10">
          <div className="group/metric">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-gray-500 font-bold uppercase text-[10px]">Liquidity</span>
              <Info className="w-3 h-3 text-gray-600" />
            </div>
            <div className="font-mono text-gray-300">${((line.liquidity || 0)).toLocaleString()}</div>
            <div className="text-[10px] text-gray-600 mt-1 hidden group-hover/metric:block absolute bg-black border border-gray-800 p-2 rounded-lg -translate-y-full -translate-x-4 w-32 z-50">
              Market depth & ease of trading.
            </div>
          </div>
          <div className="group/metric">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-gray-500 font-bold uppercase text-[10px]">Probability</span>
              <Info className="w-3 h-3 text-gray-600" />
            </div>
            <div className="font-mono text-gray-300">{(line.prob || 0).toFixed(1)}%</div>
            <div className="text-[10px] text-gray-600 mt-1 hidden group-hover/metric:block absolute bg-black border border-gray-800 p-2 rounded-lg -translate-y-full -translate-x-4 w-32 z-50">
              Implied probability of outcome.
            </div>
          </div>
        </div>
      </div>

      {/* Weight Slider (Only in weight mode) */}
      {mode === 'weight' && onWeightChange && (
        <div className="px-4 pb-4 pt-0" onClick={(e) => e.stopPropagation()}>
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={weight || 0}
            onChange={(e) => onWeightChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
          />
          <div className="flex justify-between mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Same footer actions */}
          </div>
        </div>
      )}
    </div>
  );
}
