import { Sparkles, ShieldCheck, Zap, Bookmark } from "lucide-react";

export function EngineSection() {
  return (
    <section className="relative w-full bg-background-dark py-24 px-4 overflow-hidden">
      {/* Background Glow Effect - subtle blue/purple gradient from right */}
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
          <span className="inline-block px-3 py-1 rounded-sm bg-emerald-900/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
            Our Engine
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Built for Ease,
            <br />
            Clarity & Trade-Grade.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Features */}
          <div className="space-y-12">
            {/* Feature 1 */}
            <div className="group">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center p-3 shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                   <Sparkles className="w-6 h-6 text-blue-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Ease of Use</h3>
                  <p className="text-gray-400 leading-relaxed font-light">
                    Designed so anyone can trade without feeling like they need a finance background. 
                    We turn complicated workflows into guided steps and visual interactions. 
                    The goal is to make placing a smart position feel as simple as choosing what you believe.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="flex items-start gap-6">
                 <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center p-3 shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                   <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Clarity and Trust</h3>
                  <p className="text-gray-400 leading-relaxed font-light">
                    We make risk and payoff obvious before a user commits money. 
                    PrismLines explains positions in plain language with clear visuals for upside, downside, and key assumptions, 
                    so users know exactly what they are buying. Every recommendation is backed by structured reasoning.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="flex items-start gap-6">
                 <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center p-3 shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                   <Zap className="w-6 h-6 text-purple-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Trade-Grade Execution</h3>
                  <p className="text-gray-400 leading-relaxed font-light">
                    We build the product to hold up for real trading decisions, not just demos. 
                    PrismLines is optimized for fast, responsive analysis with scenario modeling across probability shifts and time, 
                    plus multi-market strategy views. As users scale, the tooling stays reliable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Card Mockup */}
          <div className="relative">
            <div className="bg-[#12141a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Card Header Background Image or Color */}
              <div className="h-24 bg-gradient-to-r from-blue-900/40 to-slate-900/40 relative flex items-center justify-end px-6">
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <span className="text-8xl font-black text-white/5 tracking-tighter">$120M</span>
                 </div>
              </div>

               {/* Profile/Avatar Overlap */}
               <div className="px-6 relative -mt-6 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 border-2 border-[#12141a] flex items-center justify-center text-blue-400 font-bold text-sm">
                      TT
                  </div>
               </div>

               {/* Card Content */}
               <div className="px-6 pb-6">
                  <h4 className="text-xl font-bold text-white mb-3">Tariff Tracker Basket</h4>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">Economy</span>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">News</span>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">Politics</span>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">World</span>
                  </div>

                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                      <span className="text-blue-400 font-medium">Geopolitics / Trade.</span> Event-driven positioning across tariff headlines and bilateral trade moves.
                  </p>

                  <div className="text-[10px] text-gray-500 mb-4">
                      Created by: <span className="text-gray-300">PrintMoney Core</span>
                  </div>

                  <div className="border-t border-white/5 py-3 space-y-2 mb-6">
                      <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-2">Current Weights</div>
                      <div className="flex justify-between text-xs">
                          <span className="text-gray-300">CN-EV</span>
                          <span className="text-blue-400 font-mono">40.00%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                          <span className="text-gray-300">STEEL</span>
                          <span className="text-blue-400 font-mono">30.00%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                          <span className="text-gray-300">EU-DEAL</span>
                          <span className="text-blue-400 font-mono">30.00%</span>
                      </div>
                  </div>

                  <div className="flex gap-2">
                      <button className="flex-1 bg-white text-black font-bold py-2.5 rounded hover:bg-gray-200 transition-colors text-sm">
                          Invest Now
                      </button>
                      <button className="w-10 h-10 rounded bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-gray-400 transition-colors">
                          <Bookmark size={18} />
                      </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
