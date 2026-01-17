"use client";

import { TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActivePositions() {
  const positions = [
    {
      id: "AI",
      name: "Future AI Infra Fund",
      tag: "Tech",
      risk: 7,
      value: "$340,290",
      change: 32.5,
      entry: "$250k",
      target: "$400k",
      progress: 75,
      color: "bg-primary",
      iconColor: "bg-gray-800",
    },
    {
        id: "EV",
        name: "Global Lithium Supply",
        tag: "Commodities",
        risk: 4,
        value: "$128,400",
        change: 8.2,
        entry: "$118k",
        target: "$200k",
        progress: 45,
        color: "bg-primary",
        iconColor: "bg-gray-800",
      },
      {
        id: "HC",
        name: "BioTech Longevity",
        tag: "Health",
        risk: 8,
        value: "$89,150",
        change: 0.0,
        entry: "$89k",
        target: "$150k",
        progress: 15,
        color: "bg-gray-500",
        iconColor: "bg-gray-800",
      },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Active Positions</h3>
        <div className="flex gap-2">
            {/* Filter buttons mock */}
        </div>
      </div>
      <div className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden divide-y divide-border-dark shadow-sm">
        {/* Positions List */}
        {positions.map((pos, i) => (
             <div key={i} className="p-6 hover:bg-surface-hover/50 transition-colors group cursor-pointer">
             <div className="flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-lg bg-surface-hover flex items-center justify-center text-white font-bold text-lg border border-border-dark group-hover:border-primary/50 transition-colors">
                   {pos.id}
                 </div>
                 <div>
                   <h4 className="font-bold text-white group-hover:text-primary transition-colors">
                     {pos.name}
                   </h4>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-gray-400 border border-white/5">
                       {pos.tag}
                     </span>
                     <span className="text-xs text-gray-500">
                       Risk Score: {pos.risk}/10
                     </span>
                   </div>
                 </div>
               </div>
               <div className="text-right">
                 <div className="font-bold text-lg text-white">{pos.value}</div>
                 <div className={cn("text-sm font-medium flex items-center justify-end gap-1", pos.change > 0 ? "text-primary" : "text-gray-400")}>
                    {pos.change > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                   {pos.change}%
                 </div>
               </div>
             </div>
             <div className="mt-4 w-full bg-surface-hover rounded-full h-1.5 overflow-hidden">
               <div
                 className={cn("h-1.5 rounded-full", pos.color)}
                 style={{ width: `${pos.progress}%` }}
               ></div>
             </div>
             <div className="mt-2 flex justify-between text-xs text-gray-500">
               <span>Entry: {pos.entry}</span>
               <span>Target: {pos.target}</span>
             </div>
           </div>
        ))}
       
      </div>
    </div>
  );
}
