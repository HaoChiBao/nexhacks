import { ReactNode } from "react";
import { StageStepper } from "./StageStepper";
import { AgentConsole } from "./AgentConsole";
import { FundBuilderStage } from "@/lib/types/fund-builder";

interface FundBuilderLayoutProps {
  children: ReactNode;
  currentStage: FundBuilderStage;
}

export function FundBuilderLayout({ children, currentStage }: FundBuilderLayoutProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {/* Top Stepper Area */}
      <div className="pt-6 pb-2 px-6 border-b border-border-dark/50 bg-background/50 backdrop-blur-sm z-10">
        <StageStepper currentStage={currentStage} />
      </div>

      <div className="flex-grow grid grid-cols-12 overflow-hidden">
        {/* Left: Agent Console */}
        <div className="col-span-4 border-r border-border-dark bg-background/30 p-4 overflow-hidden">
          <AgentConsole />
        </div>

        {/* Center: Main Stage Content */}
        <div className="col-span-8 overflow-y-auto scrollbar-none bg-background p-8 relative">
          <div className="max-w-4xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
