"use client";

import { portfolioSummary, proposals, fundPositions } from "@/lib/mock/portfolio-data";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Activity, 
  CheckCircle, 
  Clock, 
  MoreHorizontal, 
  Search, // mapped from 'analytics'
  Bot, // mapped from 'smart_toy'
  Zap, // mapped from 'bolt'
  Microscope, // mapped from 'biotech'
  Info, // mapped from 'new_releases'
  CheckCircle2, // mapped from 'check_circle'
  Eye /* mapped from 'visibility' */ 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PortfolioAnalyticsView() {
  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* LEFT COLUMN (8 cols) */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        
        {/* Main Chart Card */}
        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-8 border border-gray-200 dark:border-border-dark shadow-ambient relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div>
                    <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">Total Portfolio Value</h2>
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                            ${portfolioSummary.totalNav.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-primary">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-bold">+{portfolioSummary.dayChangePct}%</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(30D)</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <span className="text-sm text-gray-400">Overlay:</span>
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Hedge Contribution</span>
                    </label>
                </div>
            </div>
            
            <div className="relative h-64 w-full chart-grid rounded-lg border border-gray-100 dark:border-white/5 p-4 flex items-end justify-between gap-1 group">
                 {/* Tooltip Mock */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">Nov 14: $1,180,400</div>
                </div>
                
                <svg className="absolute inset-0 w-full h-full overflow-visible p-4" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 0 }} />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M0,200 L20,190 L50,195 L80,180 L120,160 L150,165 L200,140 L250,130 L300,145 L350,120 L400,100 L450,110 L500,90 L550,80 L600,60 L650,65 L700,40 L750,20 L750,250 L0,250 Z" 
                        fill="url(#chartGradient)" 
                    />
                    <path 
                        d="M0,200 L20,190 L50,195 L80,180 L120,160 L150,165 L200,140 L250,130 L300,145 L350,120 L400,100 L450,110 L500,90 L550,80 L600,60 L650,65 L700,40 L750,20" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2" 
                        vectorEffect="non-scaling-stroke" 
                    />
                    <path 
                        className="opacity-50" 
                        d="M0,240 L20,242 L50,241 L80,238 L120,240 L150,239 L200,235 L250,238 L300,240 L350,238 L400,235 L450,236 L500,234 L550,232 L600,230 L650,231 L700,228 L750,225" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeDasharray="4" 
                        strokeWidth="1" 
                        vectorEffect="non-scaling-stroke" 
                    />
                </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
                <span>Oct 24</span>
                <span>Nov 01</span>
                <span>Nov 08</span>
                <span>Nov 15</span>
                <span>Nov 23</span>
            </div>
        </div>

        {/* Info Grid: Allocation & Risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allocation Donut */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-border-dark flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-display font-semibold text-gray-900 dark:text-white">Allocation & Risk</h3>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <div className="w-full h-full rounded-full donut-gradient mask-image mask-circle" style={{ maskImage: "radial-gradient(transparent 60%, black 61%)", WebkitMaskImage: "radial-gradient(transparent 60%, black 61%)" }}></div>
                         <div className="absolute inset-0 m-auto w-20 h-20 bg-card-light dark:bg-card-dark rounded-full flex items-center justify-center pointer-events-none">
                            <span className="text-xs font-bold text-gray-500">Dist.</span>
                        </div>
                    </div>
                    <div className="space-y-3 flex-grow">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                <span className="text-gray-400">AI Safety</span>
                            </div>
                            <span className="font-medium text-white">55%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-gray-400">US Policy</span>
                            </div>
                             <span className="font-medium text-white">20%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <span className="text-gray-400">BioTech</span>
                            </div>
                            <span className="font-medium text-white">15%</span>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-border-dark flex items-center justify-between">
                     <div className="text-xs text-gray-400">Main vs Hedge</div>
                     <div className="flex items-center gap-3">
                         <div className="relative w-10 h-10">
                            <div className="w-full h-full rounded-full mini-donut-gradient" style={{ maskImage: "radial-gradient(transparent 55%, black 56%)", WebkitMaskImage: "radial-gradient(transparent 55%, black 56%)" }}></div>
                        </div>
                         <div className="text-xs">
                             <div className="text-primary font-bold">85% Long</div>
                             <div className="text-red-500 font-bold">15% Hedge</div>
                         </div>
                     </div>
                </div>
            </div>

            {/* Risk Overview */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-border-dark flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display font-semibold text-gray-900 dark:text-white">Risk Overview</h3>
                    <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-md">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Max Drawdown</span>
                            <span className="text-red-400 font-medium">-2.1%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-white/5 rounded-full h-1.5">
                            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "21%" }}></div>
                        </div>
                    </div>
                    <div>
                         <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Volatility (30D)</span>
                            <span className="text-yellow-400 font-medium">4.2%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-white/5 rounded-full h-1.5">
                             <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: "42%" }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Expiry Concentration</span>
                            <span className="text-blue-400 font-medium">Low</span>
                         </div>
                         <div className="w-full bg-gray-200 dark:bg-white/5 rounded-full h-1.5">
                            <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: "15%" }}></div>
                         </div>
                    </div>
                </div>
                 <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="text-xs text-primary/80 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        Risk metrics within healthy range.
                    </div>
                </div>
            </div>
        </div>

        {/* Fund Positions List */}
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                 <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white">Fund Positions</h3>
                 <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                        Sort by NAV
                    </button>
                 </div>
            </div>
            
             <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-border-dark overflow-hidden divide-y divide-gray-100 dark:divide-border-dark shadow-sm">
                
                {fundPositions.map((fund, idx) => (
                    <div key={fund.id} className="group cursor-pointer">
                        <div className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4 w-1/3">
                                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", idx % 2 === 0 ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-500")}>
                                     {idx % 2 === 0 ? <Bot className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{fund.name}</h4>
                                    <span className="text-xs text-gray-500">{fund.ticker}</span>
                                </div>
                            </div>
                            <div className="w-1/4">
                                <div className="text-sm text-gray-500 mb-1">NAV Invested</div>
                                <div className="font-bold text-gray-900 dark:text-white">${fund.nav.toLocaleString()}</div>
                            </div>
                            <div className="w-1/4">
                                <div className="text-sm text-gray-500 mb-1">30D Return</div>
                                <div className="flex items-center gap-2">
                                     <svg className="w-16 h-8" viewBox="0 0 50 20">
                                        <path d="M0,15 Q10,18 20,10 T40,5 T50,2" fill="none" stroke="#10b981" strokeWidth="2"></path>
                                    </svg>
                                    <span className="text-primary font-bold text-sm">+{fund.dayChangePct}%</span>
                                </div>
                            </div>
                            <div className="w-1/6 flex justify-end">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">Hedged</span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </div>
      
      {/* RIGHT COLUMN - SIDEBAR (4 cols) */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white">Insights & Actions</h3>
        
        {/* Pending Proposals Card */}
        <div className="bg-card-light dark:bg-sidebar-dark border border-gray-200 dark:border-border-dark rounded-2xl p-0 overflow-hidden shadow-inner">
             <div className="p-4 border-b border-gray-200 dark:border-border-dark flex justify-between items-center bg-gray-50 dark:bg-white/5">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Pending Proposals</h4>
                <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                    {proposals.filter(p => p.status === 'PENDING').length} New
                </div>
             </div>
              <div className="divide-y divide-gray-100 dark:divide-border-dark">
                {proposals.filter(p => p.status === 'PENDING').slice(0, 2).map(prop => (
                    <div key={prop.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                             <span className="text-xs font-semibold text-primary uppercase">{prop.type}</span>
                             <span className="text-[10px] text-gray-400">{prop.timestamp}</span>
                        </div>
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{prop.title}</h5>
                         <p className="text-xs text-gray-500 mb-3">{prop.description}</p>
                         <div className="flex gap-2">
                             <button className="flex-1 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded text-xs font-medium transition-colors">Approve</button>
                             <button className="px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                         </div>
                    </div>
                ))}
              </div>
        </div>

        {/* What Moved Today */}
        <div className="bg-card-light dark:bg-sidebar-dark border border-gray-200 dark:border-border-dark rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
                 <Info className="w-5 h-5 text-purple-400" />
                 <h4 className="font-semibold text-sm text-gray-900 dark:text-white">What Moved Today</h4>
            </div>
            <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-primary">
                     <div className="text-[10px] text-gray-400 mb-0.5">Resolved</div>
                     <div className="text-xs font-medium text-white">Taiwan Election Result</div>
                     <div className="text-[10px] text-green-400 mt-1">Impact: +$12,400 to NAV</div>
                </div>
                 <div className="relative pl-4 border-l-2 border-gray-700">
                     <div className="text-[10px] text-gray-400 mb-0.5">Market Update</div>
                     <div className="text-xs font-medium text-white">Fed Interest Rate Decision</div>
                     <div className="text-[10px] text-gray-500 mt-1">No significant impact yet.</div>
                </div>
                <div className="relative pl-4 border-l-2 border-red-500">
                     <div className="text-[10px] text-gray-400 mb-0.5">Alert</div>
                     <div className="text-xs font-medium text-white">SpaceX Launch Delay</div>
                     <div className="text-[10px] text-red-400 mt-1">Impact: -2.3% on Space Logistics Fund</div>
                </div>
            </div>
            <button className="w-full mt-4 py-2 text-xs text-gray-400 hover:text-white border border-dashed border-gray-700 rounded-lg hover:border-gray-500 transition-all">
                View All Market Events
            </button>
        </div>
      </div>
      
    </div>
  );
}
