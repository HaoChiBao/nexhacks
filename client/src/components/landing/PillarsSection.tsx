"use client";

import { FundCard } from "@/components/funds/FundCard";
import { Fund } from "@/lib/data/funds";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

const DEMO_FUND: Fund = {
    id: "tariff-tracker",
    name: "Tariff Tracker Basket",
    thesis: "Geopolitics / Trade",
    secondaryThesis: "Event-driven positioning across tariff headlines and bilateral trade moves.",
    logo: "",
    metrics: {
        aum: 120,
    },
    tags: ["ECONOMY", "NEWS", "POLITICS", "WORLD"],
    holdings: [
        { name: "China EV Tax", ticker: "CN-EV", allocation: 40, side: "YES", prob: 0, expiry: "" },
        { name: "Steel Tariffs", ticker: "STEEL", allocation: 30, side: "YES", prob: 0, expiry: "" },
        { name: "EU Trade Deal", ticker: "EU-DEAL", allocation: 30, side: "YES", prob: 0, expiry: "" },
    ],
    createdBy: "PrintMoney Core"
};

export function PillarsSection() {
    return (
        <section className="py-24 relative overflow-hidden bg-background-dark/95">
             <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Pillars */}
                    <div className="space-y-12">
                        <div>
                             <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                                Our Engine
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                                Built for Ease, <br/> Clarity & Trade-Grade.
                            </h2>
                        </div>

                        <div className="space-y-10">
                            {/* Pillar 1 */}
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Ease of Use</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        Designed so anyone can trade without feeling like they need a finance background. We turn complicated workflows into guided steps and visual interactions. The goal is to make placing a smart position feel as simple as choosing what you believe.
                                    </p>
                                </div>
                            </div>

                             {/* Pillar 2 */}
                             <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Clarity and Trust</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        We make risk and payoff obvious before a user commits money. PrismLines explains positions in plain language with clear visuals for upside, downside, and key assumptions, so users know exactly what they are buying. Every recommendation is backed by structured reasoning and evidence, not black-box vibes.
                                    </p>
                                </div>
                            </div>

                             {/* Pillar 3 */}
                             <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Trade-Grade Execution</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        We build the product to hold up for real trading decisions, not just demos. PrismLines is optimized for fast, responsive analysis with scenario modeling across probability shifts and time, plus multi-market strategy views. As users scale from one bet to many, the tooling stays reliable, precise, and practical.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Card */}
                    <div className="flex justify-center lg:justify-end relative">
                        {/* Blob or Glow effect behind the card */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] rounded-full opacity-50 pointer-events-none"></div>

                        <div className="w-full max-w-[400px] transform hover:scale-[1.02] transition-transform duration-500">
                             <FundCard fund={DEMO_FUND} index={0} />
                        </div>
                    </div>
                </div>
             </div>
        </section>
    );
}
