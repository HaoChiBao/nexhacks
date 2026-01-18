import { LiveAgentStep } from "@/lib/types/audit";
import { cn } from "@/lib/utils";
import { Search, BookOpen, BrainCircuit, PenTool, Gavel } from "lucide-react";
import { useEffect, useRef } from "react";

interface LiveResearchFeedProps {
  steps: LiveAgentStep[];
}

const STEP_ICONS: Record<string, React.ElementType> = {
    "search": Search,
    "read": BookOpen,
    "analyze": BrainCircuit,
    "draft": PenTool,
    "decide": Gavel,
    "tool": BrainCircuit // Fallback
};

export function LiveResearchFeed({ steps }: LiveResearchFeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [steps]);

  return (
    <div className="bg-black/30 rounded-lg border border-border-dark p-3">
        <div className="flex items-center justify-between mb-2">
             <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Agent Research
            </h4>
        </div>
       
        <div ref={containerRef} className="space-y-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {steps.map((step) => {
                const Icon = STEP_ICONS[step.stepType] || BrainCircuit;
                return (
                    <div key={step.id} className="flex gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mt-0.5 text-gray-500">
                            <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-200">
                                {step.title}
                            </div>
                            {step.detail && (
                                <div className="text-gray-500 text-[10px] mt-0.5">
                                    {step.detail}
                                </div>
                            )}
                        </div>
                        <div className="ml-auto text-[9px] text-gray-600 font-mono whitespace-nowrap">
                            {new Date(step.timestampUtc).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
