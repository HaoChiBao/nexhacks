"use client";

import { ActionRequiredPanel } from "@/components/audit/ActionRequiredPanel";
import { AgentActivityCard } from "@/components/audit/AgentActivityCard";
import { AuditTrailTable } from "@/components/audit/AuditTrailTable";
import { AuditEvent, OtherAgentActivity } from "@/lib/types/audit";
import { Download, Filter } from "lucide-react";

// Hardcoded Data for Demo Consistency
const PAST_RUNS: OtherAgentActivity[] = [
    {
        id: "run-4",
        title: "Overseeing Agent",
        status: "EXECUTED",
        tags: ["Risk Guardrails", "Compliance"],
        hash: "0x8f...22",
        scheduleTime: "-2h ago"
    },
    {
        id: "run-3",
        title: "Allocator Agent",
        status: "EXECUTED",
        tags: ["Capital Deployment", "Rebalance"],
        hash: "0xTr...MP",
        scheduleTime: "-4h ago"
    },
    {
        id: "run-2",
        title: "Research Agent",
        status: "EXECUTED",
        tags: ["Deep Dive", "Macro"],
        hash: "Log #8821",
        scheduleTime: "-6h ago"
    }
];

const AUDIT_HISTORY: AuditEvent[] = [
    {
        id: "e-1",
        timestampUtc: "2026-01-18T08:00:00Z",
        eventType: "Research Agent",
        description: "Who will leave Trump Administration before 2027? (Pam Bondi 56%)",
        initiator: { kind: "agent", name: "Research Agent", avatarUrl: "AI" },
        impact: { kind: "none", label: "Odds +12%" },
        status: { kind: "onchain", state: "executed", hashOrNote: "TX: 0x8d...PamB" },
    },
    {
        id: "e-2",
        timestampUtc: "2026-01-18T06:15:00Z",
        eventType: "Research Agent",
        description: "Trump x Greenland deal signed by March 31? (41% Chance)",
        initiator: { kind: "oracle", name: "Polymarket Oracle" },
        impact: { kind: "none", label: "Vol: $1.2M" },
        status: { kind: "onchain", state: "executed", hashOrNote: "TX: 0xGr...Land" },
    },
    {
        id: "e-3",
        timestampUtc: "2026-01-17T22:30:00Z",
        eventType: "Research Agent",
        description: "Odds Trump acquires Greenland before 2027 hit __ by March 31? (29%)",
        initiator: { kind: "agent", name: "Research Agent" },
        impact: { kind: "none", label: "Target Met" },
        status: { kind: "onchain", state: "executed", hashOrNote: "TX: 0xTr...iggr" },
    },
    {
        id: "e-4",
        timestampUtc: "2026-01-17T18:00:00Z",
        eventType: "Research Agent",
        description: "What will Trump say during Panthers visit? (100% 'Unbelievable')",
        initiator: { kind: "agent", name: "Research Agent" },
        impact: { kind: "none", label: "Resolved" },
        status: { kind: "offchain", state: "executed", hashOrNote: "Res #9912" },
    },
    {
        id: "e-5",
        timestampUtc: "2026-01-17T14:45:00Z",
        eventType: "Research Agent",
        description: "Will Trump acquire Greenland before 2027? (21% Probability)",
        initiator: { kind: "agent", name: "Research Agent" },
        impact: { kind: "none", label: "Accumulating" },
        status: { kind: "onchain", state: "executed", hashOrNote: "TX: 0xAc...cumm" },
    },
    {
        id: "e-6",
        timestampUtc: "2026-01-17T09:30:00Z",
        eventType: "Research Agent",
        description: "Who will Trump nominate as Fed Chair? (Barron Trump <1%)",
        initiator: { kind: "agent", name: "Research Agent" },
        impact: { kind: "none", label: "Filter: Noise" },
        status: { kind: "onchain", state: "executed", hashOrNote: "Skip #1102" },
    }
];

export default function AuditPage() {
    // No Loading State - Instant Render

    // CSV Export
    const handleExport = () => {
        // Basic CSV stub
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Timestamp,EventType,Description,Initiator,Impact,Status\n"
            + AUDIT_HISTORY.map(e => `${e.timestampUtc},${e.eventType},"${e.description}",${e.initiator.name},${e.impact.label},${e.status.hashOrNote}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `audit-trail-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen p-6 lg:p-8 pt-24 font-sans text-gray-100 relative">
            {/* Canvas Background to cover global effects */}
            <div className="fixed inset-0 bg-[#0A0A0A] -z-10" />

            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Agent Operations Center</h1>
                        <p className="text-gray-400 text-sm">Monitor live agent reasoning and review historical execution logs.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-surface-dark border border-border-dark hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                        <button className="flex items-center gap-2 bg-surface-dark border border-border-dark hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>
                </div>

                {/* Section 1: Live Feed & History */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Agent Feed</span>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* Main Action Card */}
                        <div className="xl:col-span-3">
                            <ActionRequiredPanel />
                        </div>

                        {/* Right Column: Other Activities */}
                        <div className="xl:col-span-1 space-y-4">
                            <div className="bg-surface-dark rounded-xl border border-border-dark p-4 h-full">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Past Agent Runs</div>
                                <div className="flex flex-col">
                                    {PAST_RUNS.map(act => (
                                        <AgentActivityCard key={act.id} activity={act} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Immutable Audit Trail */}
                <div className="mt-8">
                    <AuditTrailTable
                        events={AUDIT_HISTORY}
                        total={AUDIT_HISTORY.length}
                        page={1}
                        onPageChange={() => { }}
                        onExport={handleExport}
                    />
                </div>
            </div>
        </div>
    );
}
