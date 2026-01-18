"use client";

import { useState } from "react";
import { X, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";

interface DepositExecuteDrawerProps {
  children: React.ReactNode;
}

export function DepositExecuteDrawer({ children }: DepositExecuteDrawerProps) {
  const [amount, setAmount] = useState<string>("");
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    setIsOpen(false);
    toast({
      title: "Proposal Created",
      description: `Execution proposal for ${amount} PM credits has been submitted for approval.`,
    });
    setAmount("");
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="bg-surface-dark border-t border-border-dark text-white">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Deposit & Execute</DrawerTitle>
            <DrawerDescription>Add liquidity to your strategy positions.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-6">
             <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-gray-400">Amount (PM Credits)</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-mono">PM</span>
                        <Input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-10 bg-gray-900 border-gray-700 text-white font-mono text-lg" 
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    {[50, 100, 500].map(val => (
                        <button 
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 transition-colors"
                        >
                            +{val}
                        </button>
                    ))}
                    <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-primary border border-gray-700 ml-auto transition-colors">
                        Max
                    </button>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-gray-400">Execution Target</label>
                <div className="p-3 bg-gray-900 rounded border border-gray-700 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Portfolio Rebalance</span>
                        <span className="text-xs text-gray-500">Auto-distribute across 2 funds</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
             </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-base">
              Create Execution Proposal <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
