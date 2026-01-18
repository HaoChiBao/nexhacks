"use client";

import { useEffect, useState } from "react";
import { ActionRequiredPanel } from "@/components/audit/ActionRequiredPanel";
import { AgentActivityCard } from "@/components/audit/AgentActivityCard";
import { AuditTrailTable } from "@/components/audit/AuditTrailTable";
import { auditApi } from "@/services/auditApi";
import { AuditEvent, LiveAgentStep, OtherAgentActivity, ProposalSummary } from "@/lib/types/audit";
import { Download, Filter, Loader2 } from "lucide-react";

export default function AuditPage() {
  // State
  const [proposal, setProposal] = useState<ProposalSummary | null>(null);
  const [liveSteps, setLiveSteps] = useState<LiveAgentStep[]>([]);
  const [activities, setActivities] = useState<OtherAgentActivity[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    async function fetchData() {
        try {
            const [propData, actsData, eventsData] = await Promise.all([
                auditApi.getPendingProposal(),
                auditApi.listOtherActivities(),
                auditApi.listAuditEvents({}, 1)
            ]);
            
            setProposal(propData);
            setActivities(actsData);
            setEvents(eventsData.rows);
            setTotalEvents(eventsData.total);
        } catch (error) {
            console.error("Failed to load audit data", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  // Pagination Handler
  const handlePageChange = async (newPage: number) => {
    setLoading(true); // Ideally show local spinner for table only
    try {
        const data = await auditApi.listAuditEvents({}, newPage);
        setEvents(data.rows);
        setPage(newPage);
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  // Real-time Subscription
  useEffect(() => {
      if (!proposal?.id) return;
      
      const unsubscribe = auditApi.subscribeAgentFeed(proposal.id, (step) => {
          setLiveSteps(prev => [...prev, step]);
      });

      return () => unsubscribe();
  }, [proposal?.id]);

  // CSV Export
  const handleExport = () => {
    // Basic CSV stub
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Timestamp,EventType,Description,Initiator,Impact,Status\n"
        + events.map(e => `${e.timestampUtc},${e.eventType},"${e.description}",${e.initiator.name},${e.impact.label},${e.status.hashOrNote}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit-trail-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !proposal) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 pt-24 font-sans text-gray-100 relative">
      {/* Canvas Background to cover global effects */}
      <div className="fixed inset-0 bg-[#0A0A0A] -z-10" />

      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Proposals & Audit Trail</h1>
                <p className="text-gray-400 text-sm">Review pending strategy adjustments and verify immutable fund history.</p>
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

        {/* Section 1: Action Required & Activities */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Action Required</span>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Action Card */}
                <div className="xl:col-span-3">
                    <ActionRequiredPanel proposal={proposal} liveSteps={liveSteps} />
                </div>

                {/* Right Column: Other Activities */}
                <div className="xl:col-span-1 space-y-4">
                     <div className="bg-surface-dark rounded-xl border border-border-dark p-4 h-full">
                         <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Other Agent Activity</div>
                         <div className="flex flex-col">
                            {activities.map(act => (
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
                events={events} 
                total={totalEvents} 
                page={page} 
                onPageChange={handlePageChange} 
                onExport={handleExport} 
            />
        </div>
      </div>
    </div>
  );
}
