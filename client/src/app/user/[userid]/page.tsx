
import { InvestedFundsTable } from "@/components/profile/InvestedFundsTable";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileQrCard } from "@/components/profile/ProfileQrCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UserProfile, UserPortfolioSnapshot, FundInvestment } from "@/lib/mock/users";

// Force dynamic rendering since we are fetching user specific data
export const dynamic = 'force-dynamic';

async function getData(userid: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
        const res = await fetch(`${apiUrl}/users/${userid}/profile`, { 
            cache: 'no-store',
            next: { revalidate: 0 }
        });
        
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch user data');
        }
        
        return res.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

export default async function UserProfilePage({ params }: { params: { userid: string } }) {
    const userData = await getData(params.userid);

    if (!userData) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-white mb-2">User Not Found</h1>
                <p className="text-gray-500 mb-6">We couldn't locate a profile for @{params.userid}.</p>
                <Link href="/" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Return Home
                </Link>
            </div>
        );
    }

    // Map backend response to UI models
    const profile: UserProfile = {
        id: userData.id,
        name: userData.name || "Anonymous User",
        handle: userData.handle || userData.email?.split('@')[0] || "anon",
        avatarUrl: userData.avatarUrl || userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`,
        bio: userData.bio || `Investor since ${new Date(userData.updated_at || Date.now()).getFullYear()}`,
        joinedAt: userData.updated_at,
        isPublic: true // Default to true for now
    };

    // Calculate Portfolio Stats
    const investments: FundInvestment[] = (userData.portfolio || []).map((inv: any) => ({
        fundId: inv.fund_id || inv.id || "unknown",
        fundName: inv.fundName || inv.name || "Unnamed Fund",
        fundCategory: inv.fundCategory || "Active",
        investedPm: parseFloat(inv.investedPm || inv.invested_amount || 0),
        currentNavPm: parseFloat(inv.currentNavPm || inv.current_value || inv.invested_amount || 0),
        return30dPct: parseFloat(inv.return30dPct || inv.pnl_percent || 0),
        topMarkets: inv.topMarkets || []
    }));

    const totalInvestedPm = investments.reduce((acc, curr) => acc + curr.investedPm, 0);
    const totalNavPm = investments.reduce((acc, curr) => acc + curr.currentNavPm, 0);

    const portfolio: UserPortfolioSnapshot = {
        userId: userData.id,
        totalInvestedPm: totalInvestedPm > 0 ? totalInvestedPm : parseFloat(userData.balance || 0), // Fallback to balance if no investments? No, separate concepts.
        // Actually, existing mock design showed Total NAV distinct from wallet balance. 
        // If userData.balance is "Wallet Balance", that's different from "Invested NAV".
        // Let's assume userData.balance is CASH balance.
        // So Total NAV = Cash + Invested NAV
        totalNavPm: totalNavPm + parseFloat(userData.balance || 0), 
        fundsCount: investments.length,
        updatedAt: userData.updated_at,
        investments: investments
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 space-y-6">
                
                {/* 1. Header Section */}
                <ProfileHeader profile={profile} portfolio={portfolio} />

                {/* 2. Main Grid */}
                {portfolio.investments.length > 0 || parseFloat(userData.balance) > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Left: Investments */}
                        <div className="md:col-span-8 space-y-6">
                             <InvestedFundsTable 
                                investments={portfolio.investments} 
                                totalInvested={portfolio.totalInvestedPm}
                             />
                        </div>

                        {/* Right: Sidebar */}
                        <div className="md:col-span-4 space-y-6">
                             {/* QR Share Card */}
                             <ProfileQrCard userId={profile.id} />
                             
                             {/* Balance Card (Extra for Real Data) */}
                             <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                                 <h4 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Available Cash</h4>
                                 <div className="text-2xl font-mono font-bold text-white">
                                     {parseFloat(userData.balance || 0).toLocaleString()} <span className="text-emerald-500 text-sm">PM</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                ) : (
                    // Private or Empty State
                    <div className="p-12 text-center border border-dashed border-gray-800 rounded-2xl">
                        <p className="text-gray-500">This user's portfolio is empty.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
