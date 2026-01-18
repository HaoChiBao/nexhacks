import { FundBuilderStage } from "@/lib/types/fund-builder";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StageStepperProps {
  currentStage: FundBuilderStage;
}

const STAGES: { id: FundBuilderStage; label: string; step: number }[] = [
  { id: "RESEARCH", label: "Research", step: 1 },
  { id: "LINE_POPULATION", label: "Line Population", step: 2 },
  { id: "WEIGHTING", label: "Weighting", step: 3 },
  { id: "FINALIZE", label: "Finalize", step: 4 },
];

export function StageStepper({ currentStage }: StageStepperProps) {
  const currentStepIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-8">
      {STAGES.map((stage, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;

        return (
          <div key={stage.id} className="flex items-center w-full last:w-auto">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-colors",
                  isActive
                    ? "bg-emerald-500 text-black border-emerald-500"
                    : isCompleted
                    ? "bg-emerald-900/20 text-emerald-500 border-emerald-500/20"
                    : "bg-surface-dark text-gray-600 border-gray-700"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stage.step}
              </div>
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  isActive ? "text-white" : isCompleted ? "text-emerald-500" : "text-gray-600"
                )}
              >
                {stage.label}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <div className="flex-1 mx-4 h-[2px] bg-gray-800 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500"
                  style={{
                    width: isCompleted ? "100%" : isActive ? "50%" : "0%",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
