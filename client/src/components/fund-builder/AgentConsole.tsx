import { useFundBuilderStore } from "@/store/useFundBuilderStore";
import { BrainCircuit, Loader2, FileText, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AgentConsole() {
  const { agentEvents, isAnalyzing, resourceLinks, draft } = useFundBuilderStore();

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Agent Analysis Card */}
      <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-900/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Agent Analysis</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Stage 2: Line Population
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[10px] text-gray-500 mb-1">SELECTED TOPIC</p>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white leading-tight">
              {draft.name || "New Fund Strategy"}
            </h2>
            <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-500 border border-emerald-800 rounded text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </span>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
          <p className="text-xs text-gray-400 leading-relaxed">
            I have identified 8 high-signal prediction lines with &gt;$2M combined liquidity. 
            The basket focuses on legislative milestones in the US and EU.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
             {draft.universeRules.includeTags.map(tag => (
                 <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-[10px] rounded border border-gray-600">
                    {tag}
                 </span>
             ))}
          </div>
        </div>
      </div>

      {/* Agent Console Feed */}
      <div className="bg-surface-dark border border-border-dark rounded-xl flex-grow overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border-dark flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-white">Agent Console</h3>
              </div>
              {isAnalyzing && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          </div>
          
          <div className="p-4 overflow-y-auto space-y-6 flex-grow scrollbar-none">
             {agentEvents.map((event) => (
                 <div key={event.id} className="relative pl-4 border-l border-gray-800">
                     <div className={cn(
                         "absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-surface-dark",
                         event.status === 'running' ? "bg-amber-500" : "bg-emerald-500"
                     )} />
                     <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-500 font-mono">
                                 {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} UTC
                             </span>
                             {event.status === 'running' && <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />}
                         </div>
                         <h4 className="text-xs font-bold text-gray-200">{event.title}</h4>
                         <p className="text-xs text-gray-500 leading-snug">{event.message}</p>
                     </div>
                 </div>
             ))}
             
             {agentEvents.length === 0 && (
                <div className="text-center text-gray-600 text-xs py-10">
                    Agent is ready to assist.
                </div>
             )}
          </div>
          
          {/* Resources */}
          {resourceLinks.length > 0 && (
              <div className="p-4 border-t border-border-dark bg-gray-900/20">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-3">Resources & Artifacts</p>
                  <div className="space-y-2">
                      {resourceLinks.map((link, i) => (
                          <div key={i} className="flex items-center justify-between group cursor-pointer p-2 rounded hover:bg-gray-800/50 transition-colors">
                              <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-400 group-hover:text-emerald-400" />
                                  <span className="text-xs text-gray-300 group-hover:text-white">{link.title}</span>
                              </div>
                              <LinkIcon className="w-3 h-3 text-gray-600 group-hover:text-emerald-500" />
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
