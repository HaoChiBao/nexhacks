import { useFundBuilderStore } from "@/store/useFundBuilderStore";
import { cn } from "@/lib/utils";
import { Bot, Clock, Loader2, BrainCircuit } from "lucide-react";
import { useEffect, useRef } from "react";

// No props needed - direct store access
export function ActionRequiredPanel() {
    const { agentEvents, isAnalyzing } = useFundBuilderStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [agentEvents]);

    return (
        <div className="bg-surface-dark border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.05)] flex flex-col h-full min-h-[500px]">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-border-dark bg-gradient-to-r from-emerald-900/10 to-transparent">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-3">
                            <BrainCircuit className="w-5 h-5 text-emerald-400" />
                            Live Agent Monitor
                            {isAnalyzing && (
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Active
                                </span>
                            )}
                        </h2>
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-mono mt-1.5">
                            <span className="flex items-center gap-1.5">
                                <Bot className="w-3 h-3" /> Agent: AlphaGuard-V2
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3" /> Session Uptime: 4m 20s
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Log Content */}
            <div className="flex-grow bg-black/20 relative">
                <div className="absolute inset-0 overflow-y-auto scrollbar-hide p-6 space-y-4" ref={scrollRef}>
                    {agentEvents.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-3 opacity-50">
                            <Bot className="w-12 h-12" />
                            <p className="text-sm font-mono">Waiting for agent activity...</p>
                        </div>
                    )}

                    {agentEvents.map((event, idx) => (
                        <div key={idx} className={cn(
                            "relative pl-6 border-l-2 transition-all duration-300 animate-in fade-in slide-in-from-left-2",
                            event.status === 'running' ? "border-amber-500 bg-amber-500/5 rounded-r-lg" : "border-emerald-500/30"
                        )}>
                            <div className={cn(
                                "absolute -left-[5px] top-3 w-2.5 h-2.5 rounded-full border-2 border-surface-dark shadow-sm z-10",
                                event.status === 'running' ? "bg-amber-500 animate-pulse" : "bg-emerald-600"
                            )} />

                            <div className="py-2 pr-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className={cn(
                                        "text-sm font-bold",
                                        event.status === 'running' ? "text-amber-400" : "text-emerald-100"
                                    )}>
                                        {event.title}
                                    </h4>
                                    <span className="text-[10px] text-gray-600 font-mono">
                                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                                    {event.message}
                                </p>
                                {event.status === 'running' && (
                                    <div className="mt-2 flex items-center gap-2 text-[10px] text-amber-500/80 font-mono uppercase tracking-wider">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Processing
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Status */}
            <div className="p-3 border-t border-border-dark bg-gray-900/40 flex justify-between items-center text-[10px] text-gray-600 font-mono uppercase">
                <span>System: Online</span>
                <span>Connection: Secure (TLS 1.3)</span>
            </div>
        </div>
    );
}
