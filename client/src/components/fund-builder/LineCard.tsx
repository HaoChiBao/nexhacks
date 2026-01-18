import { MarketLine } from "@/lib/types/fund-builder";
import { cn } from "@/lib/utils";
import { Info, ExternalLink, Activity } from "lucide-react";

interface LineCardProps {
  line: MarketLine;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  weight?: number;
  onWeightChange?: (val: number) => void;
  mode: 'select' | 'weight';
}

export function LineCard({ line, isSelected, onToggleSelect, weight, onWeightChange, mode }: LineCardProps) {
  return (
    <div 
      className={cn(
        "group relative bg-surface-dark border rounded-xl overflow-hidden transition-all duration-300",
        isSelected 
          ? "border-emerald-500/50 bg-emerald-900/10 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]" 
          : "border-border-dark hover:border-gray-600"
      )}
    >
        {/* Header Section */}
      <div className="p-4 flex gap-4">
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-1">
             <h4 className="text-sm font-bold text-gray-200 leading-snug max-w-[85%]">
               {line.question}
             </h4>
             {line.cluster && (
                 <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800/50">
                     {line.cluster === 'High Liquidity' ? 'Liq' : 'Corr'}
                 </span>
             )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
            <span className="flex items-center gap-1">
                <img src="https://polymarket.com/favicon.ico" alt="poly" className="w-3 h-3 grayscale opacity-60" />
                Polymarket
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-600" />
            <span className="font-mono text-gray-400">${(line.volume / 1000).toFixed(1)}k Vol</span>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-600" />
            <span className={cn(
                "font-bold",
                line.correlationScore > 0.8 ? "text-emerald-500" : "text-yellow-500"
            )}>
                {(line.correlationScore * 100).toFixed(0)}% Corr
            </span>
          </div>
        </div>

        {/* Action / Value Section */}
        <div className="flex flex-col items-end gap-2 min-w-[80px]">
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

       {/* Weight Slider (Only in weight mode) */}
       {mode === 'weight' && onWeightChange && (
           <div className="px-4 pb-4 pt-0">
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
                   <div className="flex items-center gap-1 text-[10px] text-emerald-500/80 cursor-pointer hover:underline">
                        <Activity className="w-3 h-3" /> Analyze
                   </div>
                   <div className="flex items-center gap-1 text-[10px] text-gray-500 cursor-pointer hover:text-white transition-colors">
                       <ExternalLink className="w-3 h-3" /> View Source
                   </div>
               </div>
           </div>
       )}
    </div>
  );
}
