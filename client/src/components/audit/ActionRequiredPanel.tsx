import { ProposalSummary, LiveAgentStep } from "@/lib/types/audit";
import { cn } from "@/lib/utils";
import { ArrowRight, Bot, Clock, ShieldCheck, Check } from "lucide-react";
import { LiveResearchFeed } from "./LiveResearchFeed";

interface ActionRequiredPanelProps {
  proposal: ProposalSummary | null;
  liveSteps: LiveAgentStep[];
}

export function ActionRequiredPanel({ proposal, liveSteps }: ActionRequiredPanelProps) {
  if (!proposal) return null;

  return (
    <div className="bg-surface-dark border border-amber-500/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.05)] flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-border-dark bg-gradient-to-r from-amber-900/10 to-transparent">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-3">
                    {proposal.title}
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-amber-500/30">
                        {proposal.status}
                    </span>
                </h2>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono mt-1.5">
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {proposal.createdAgo}
                    </span>
                    <span>ID: {proposal.hashId}</span>
                    <span className="flex items-center gap-1.5 text-gray-400">
                        <Bot className="w-3 h-3" /> Agent: {proposal.agentName}
                    </span>
                </div>
            </div>
            
            <button className="bg-surface-dark hover:bg-gray-800 border border-border-dark text-blue-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5" />
                Rationale: {proposal.rationale}
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 flex-grow">
        {/* Analysis */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
             <div className="text-sm text-gray-300 leading-relaxed">
                <span className="font-bold text-gray-100">Analysis: </span>
                {proposal.analysisText}
             </div>
        </div>

        {/* Adjustments Table */}
        <div className="w-full">
             <div className="grid grid-cols-12 text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 px-2">
                <div className="col-span-6">Market / Asset</div>
                <div className="col-span-2 text-right">Current Weight</div>
                <div className="col-span-2 text-right">Proposed Weight</div>
                <div className="col-span-2 text-right">Delta</div>
             </div>
             <div className="space-y-1">
                {proposal.adjustments.map((adj, i) => {
                    const delta = adj.proposedWeight - adj.currentWeight;
                    return (
                        <div key={i} className="grid grid-cols-12 items-center bg-gray-800/20 border border-border-dark rounded-lg p-3 text-sm">
                            <div className="col-span-6 font-medium text-gray-200 flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gray-700 flex-shrink-0"></div>
                                {adj.market}
                            </div>
                            <div className="col-span-2 text-right text-gray-400 font-mono">
                                {adj.currentWeight.toFixed(1)}%
                            </div>
                            <div className="col-span-2 text-right text-gray-100 font-bold font-mono group flex items-center justify-end gap-2">
                                <ArrowRight className="w-3 h-3 text-gray-600" />
                                {adj.proposedWeight.toFixed(1)}%
                            </div>
                            <div className={cn("col-span-2 text-right font-mono font-medium", delta > 0 ? "text-emerald-400" : "text-red-400")}>
                                {delta > 0 ? "+" : ""}{delta.toFixed(1)}%
                            </div>
                        </div>
                    );
                })}
             </div>
        </div>

        {/* Live Feed */}
        <LiveResearchFeed steps={liveSteps} />
      </div>

      {/* Footer Actions */}
      <div className="p-6 pt-4 border-t border-border-dark bg-gray-900/20 flex items-center justify-between">
            <div className="text-xs text-gray-500">
                Requires {proposal.approvals.required}/3 Multi-sig approval. ({proposal.approvals.signed} Signed)
            </div>
            <div className="flex items-center gap-3">
                <button className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 hover:bg-red-950/30 rounded-lg transition-colors">
                    Reject Proposal
                </button>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-6 py-2 rounded-lg shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all">
                    <Check className="w-4 h-4" />
                    Approve & Sign
                </button>
            </div>
      </div>
    </div>
  );
}
