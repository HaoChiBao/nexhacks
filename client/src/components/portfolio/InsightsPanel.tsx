"use client";

import { ProposalItem } from "@/lib/types/portfolio";
import { Check, Clock, Eye, FileText, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface InsightsPanelProps {
  proposals: ProposalItem[];
}

export function InsightsPanel({ proposals }: InsightsPanelProps) {
  return (
    <div className="flex flex-col gap-6 h-full">
         <h3 className="text-xl font-bold text-white">Insights & Actions</h3>

         {/* Proposals Card */}
         <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden flex flex-col">
             <div className="p-4 border-b border-border-dark flex justify-between items-center bg-gray-900/50">
                 <h4 className="font-bold text-gray-200 text-sm">Pending Proposals</h4>
                 <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20">
                     {proposals.length} New
                 </span>
             </div>
             
             <div className="divide-y divide-border-dark">
                 {proposals.map(proposal => (
                     <div key={proposal.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                             <span className={cn(
                                 "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                                 proposal.type === 'REBALANCE' ? "bg-blue-900/20 text-blue-400 border-blue-900" : "bg-rose-900/20 text-rose-400 border-rose-900"
                             )}>
                                 {proposal.type.replace('_', ' ')}
                             </span>
                             <span className="text-[10px] text-gray-500">{proposal.createdAgo}</span>
                         </div>
                         <h5 className="font-bold text-white text-sm mb-1">{proposal.title}</h5>
                         <p className="text-xs text-gray-400 mb-4 leading-relaxed">{proposal.summary}</p>
                         
                         {/* Action Buttons */}
                         <div className="flex gap-2">
                             <button className="flex-1 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-500 border border-emerald-900/50 rounded py-1.5 text-xs font-bold transition-colors">
                                 Approve
                             </button>
                             <button className="w-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 rounded transition-colors">
                                 <Eye className="w-3.5 h-3.5" />
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {/* What Moved Today */}
         <div className="bg-surface-dark border border-border-dark rounded-xl p-4 flex-grow">
             <div className="flex items-center gap-2 mb-4">
                 <div className="p-1 bg-purple-900/30 rounded text-purple-400"><Check className="w-4 h-4" /></div>
                 <h4 className="font-bold text-white text-sm">What Moved Today</h4>
             </div>
             
             <div className="space-y-4">
                 <div className="relative pl-4 border-l-2 border-emerald-500/30">
                     <span className="text-[10px] text-gray-500 block mb-1">Resolved</span>
                     <h5 className="text-xs font-bold text-white">Taiwan Election Result</h5>
                     <p className="text-[10px] text-emerald-400 mt-1">Impact: +$12,400 to NAV</p>
                 </div>
                 <div className="relative pl-4 border-l-2 border-gray-700">
                     <span className="text-[10px] text-gray-500 block mb-1">Market Update</span>
                     <h5 className="text-xs font-bold text-white">Fed Interest Rate Decision</h5>
                     <p className="text-[10px] text-gray-400 mt-1">No significant impact yet.</p>
                 </div>
                  <div className="relative pl-4 border-l-2 border-rose-500/30">
                     <span className="text-[10px] text-gray-500 block mb-1">Alert</span>
                     <h5 className="text-xs font-bold text-white">SpaceX Launch Delay</h5>
                     <p className="text-[10px] text-rose-400 mt-1">Impact: -2.3% on Space Logistics Fund</p>
                 </div>
             </div>
             
             <button className="w-full mt-6 py-2 border border-gray-700 text-gray-400 text-xs rounded hover:text-white hover:border-gray-500 transition-colors">
                 View All Market Events
             </button>
         </div>
    </div>
  );
}
