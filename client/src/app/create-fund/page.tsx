'use client';

import { useEffect, useState } from 'react';
import { useFundBuilderStore } from '@/store/useFundBuilderStore';
import { FundBuilderLayout } from '@/components/fund-builder/FundBuilderLayout';
import { ResearchStage } from '@/components/fund-builder/stages/1-ResearchStage';
import { LinePopulationStage } from '@/components/fund-builder/stages/2-LinePopulationStage';
import { WeightingStage } from '@/components/fund-builder/stages/3-WeightingStage';
import { FinalizeStage } from '@/components/fund-builder/stages/4-FinalizeStage';

export default function CreateFundPage() {
  const { currentStage, resetDraft } = useFundBuilderStore();
  const [mounted, setMounted] = useState(false);

  // Reset store on mount to ensure fresh state
  useEffect(() => {
    resetDraft();
    setMounted(true);
  }, [resetDraft]);

  if (!mounted) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-emerald-500 animate-pulse">Loading Builder...</div>
        </div>
    );
  }

  const renderStage = () => {
    switch (currentStage) {
      case 'RESEARCH':
        return <ResearchStage />;
      case 'LINE_POPULATION':
        return <LinePopulationStage />;
      case 'WEIGHTING':
        return <WeightingStage />;
      case 'FINALIZE':
        return <FinalizeStage />;
      default:
        return <ResearchStage />;
    }
  };

  return (
    <FundBuilderLayout currentStage={currentStage}>
      {renderStage()}
    </FundBuilderLayout>
  );
}

