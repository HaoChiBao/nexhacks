"use client";

import { PortfolioSummary, FundPosition, ProposalItem } from "@/lib/types/portfolio";
import { PortfolioChart } from "./PortfolioChart";
import { AllocationRiskWidget } from "./AllocationRiskWidget";
import { InsightsPanel } from "./InsightsPanel";
import { FundPositionsList } from "./FundPositionsList";

interface PortfolioAnalyticsViewProps {
    data: PortfolioSummary;
    proposals: ProposalItem[];
    funds: FundPosition[];
}

export function PortfolioAnalyticsView({ data, proposals, funds }: PortfolioAnalyticsViewProps) {
  return (
    <div className="animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left Column: Chart & Risk */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                 {/* Main Chart */}
                 <PortfolioChart data={data.navSeries} />
                 
                 {/* Allocation & Risk Row */}
                 <div className="h-[400px]">
                     <AllocationRiskWidget data={data} />
                 </div>
            </div>

            {/* Right Column: Insights & Actions */}
            <div className="lg:col-span-4 h-full min-h-[500px]">
                <InsightsPanel proposals={proposals} />
            </div>
        </div>

        {/* Bottom Section: Positions */}
        <div className="pb-12">
            <FundPositionsList funds={funds} />
        </div>
    </div>
  );
}
