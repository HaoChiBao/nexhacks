export type AuditEventType = 
  | "Rebalance" 
  | "Market Resolution" 
  | "Parameter Update" 
  | "Proposal Rejected" 
  | "Proposal Approved" 
  | "Agent Research" 
  | "Execution";

export interface AuditEvent {
  id: string;
  timestampUtc: string; // ISO string
  eventType: AuditEventType;
  description: string;
  initiator: {
    kind: "agent" | "oracle" | "admin";
    name: string;
    id?: string;
    avatarUrl?: string; // Optional URL or predefined identifier
  };
  impact: {
    kind: "vol" | "pnl" | "fee" | "none";
    value?: number;
    currency?: "USD";
    label?: string; // e.g. "Vol: -0.4%"
  };
  status: {
    kind: "onchain" | "offchain";
    state: "queued" | "executed" | "rejected" | "info";
    hashOrNote: string;
  };
  relatedProposalId?: string;
}

export interface ProposalAction {
  market: string;
  currentWeight: number; // percentage i.e. 28.5
  proposedWeight: number;
}

export interface ProposalSummary {
  id: string; // e.g. "2491"
  hashId: string; // e.g. "0x8a...4b2"
  title: string;
  status: "PENDING REVIEW" | "APPROVED" | "REJECTED";
  createdAgo: string; // e.g. "45 mins ago"
  agentName: string;
  rationale: string;
  analysisText: string;
  adjustments: ProposalAction[];
  approvals: {
    required: number;
    signed: number;
  };
}

export interface LiveAgentStep {
  id: string;
  timestampUtc: string;
  stepType: "search" | "read" | "analyze" | "draft" | "decide" | "tool";
  title: string;
  detail?: string;
  sourceUrl?: string;
}

export interface OtherAgentActivity {
  id: string;
  title: string;
  status: "QUEUED" | "EXECUTED" | "RESEARCHING";
  tags: string[];
  scheduleTime?: string; // "Scheduled: +2h"
  hash?: string;
}
