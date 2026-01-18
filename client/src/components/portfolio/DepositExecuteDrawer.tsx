"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Plus, ArrowRight, Wallet, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DepositExecuteDrawer() {
  const [amount, setAmount] = useState<string>("");
  const [target, setTarget] = useState<"portfolio" | "fund">("portfolio");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateProposal = () => {
    // Mock action
    setIsOpen(false);
    // In real app, trigger toast here
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Plus className="w-4 h-4" /> Deposit & Invest
        </button>
      </SheetTrigger>
      <SheetContent className="bg-surface-dark border-border-dark text-white w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-white text-xl flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" /> Deposit & Execute
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Add PM Credits to your portfolio and generate an execution proposal.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-8 space-y-6">
            {/* Amount Input */}
            <div className="space-y-3">
                <Label className="text-gray-300">Amount (Credits)</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">PM</span>
                    <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black/40 border-gray-700 pl-10 text-lg font-mono text-emerald-400 focus-visible:ring-emerald-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    {[100, 500, 1000].map(val => (
                        <button 
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded border border-gray-700 transition-colors"
                        >
                            +{val}
                        </button>
                    ))}
                </div>
            </div>

            {/* Target Selector */}
            <div className="space-y-3">
                <Label className="text-gray-300">Target Allocation</Label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setTarget('portfolio')}
                        className={`p-3 rounded-lg border text-left transition-all ${target === 'portfolio' ? 'bg-emerald-900/20 border-emerald-500 ring-1 ring-emerald-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-750'}`}
                    >
                        <div className="font-bold text-sm mb-1">Entire Portfolio</div>
                        <div className="text-xs text-gray-400">Distribute based on current weights</div>
                    </button>
                    <button
                        onClick={() => setTarget('fund')}
                        className={`p-3 rounded-lg border text-left transition-all ${target === 'fund' ? 'bg-emerald-900/20 border-emerald-500 ring-1 ring-emerald-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-750'}`}
                    >
                        <div className="font-bold text-sm mb-1">Specific Strategy</div>
                        <div className="text-xs text-gray-400">Manually select alpha fund</div>
                    </button>
                </div>
            </div>

            {/* Allocation Preview */}
            <div className="bg-black/20 rounded-lg p-4 border border-gray-800/50">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase text-gray-500">Est. Allocation Preview</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">AI Safety & Policy</span>
                        <span className="font-mono text-emerald-400">{(Number(amount || 0) * 0.55).toFixed(0)} PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">US Policy 2025</span>
                        <span className="font-mono text-emerald-400">{(Number(amount || 0) * 0.20).toFixed(0)} PM</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-800 mt-2">
                        <span className="text-rose-400 flex items-center gap-1"><Shield className="w-3 h-3" /> Auto-Hedge Reserve (15%)</span>
                        <span className="font-mono text-rose-400">{(Number(amount || 0) * 0.15).toFixed(0)} PM</span>
                    </div>
                </div>
            </div>
        </div>

        <SheetFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={handleCreateProposal} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold">
                Create Execution Proposal <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-[10px] text-center text-gray-500">
                Proposal will require Review & Approval before Credits are deployed.
            </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
