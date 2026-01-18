"use client";

import { UserProfile, UserPortfolioSnapshot } from "@/lib/mock/users";
import { cn } from "@/lib/utils";
import { User, Wallet, Copy, Share2, Globe, Lock } from "lucide-react";

interface ProfileHeaderProps {
    profile: UserProfile;
    portfolio?: UserPortfolioSnapshot;
}

export function ProfileHeader({ profile, portfolio }: ProfileHeaderProps) {
    return (
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 lg:p-8 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* User Info */}
                <div className="flex items-start gap-5">
                    <div className="relative">
                        <img 
                            src={profile.avatarUrl} 
                            alt={profile.name} 
                            className="w-20 h-20 rounded-2xl border-2 border-gray-800 bg-[#0A0A0A] object-cover shadow-2xl"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-gray-900 border border-border-dark p-1.5 rounded-lg shadow-lg">
                            {profile.isPublic ? <Globe className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                    </div>
                    
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1 leading-tight">{profile.name}</h1>
                        <p className="text-emerald-500 font-mono text-sm mb-3">@{profile.handle}</p>
                        
                        {profile.bio && (
                            <p className="text-gray-400 text-sm max-w-md leading-relaxed hidden md:block">
                                {profile.bio}
                            </p>
                        )}
                    </div>
                </div>

                {/* Stats Row */}
                {portfolio && (
                     <div className="flex items-center divide-x divide-gray-800 bg-[#0A0A0A]/50 border border-gray-800 rounded-xl p-4 backdrop-blur-sm">
                        <div className="px-6 first:pl-2">
                             <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Total NAV</div>
                             <div className="text-2xl font-mono font-bold text-white flex items-baseline gap-1">
                                {portfolio.totalNavPm.toLocaleString()} 
                                <span className="text-xs text-emerald-500 font-sans">PM</span>
                             </div>
                        </div>
                        <div className="px-6">
                             <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Funds</div>
                             <div className="text-2xl font-mono font-bold text-white">
                                {portfolio.fundsCount}
                             </div>
                        </div>
                        <div className="px-6 last:pr-2">
                             <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Since Join</div>
                             <div className="text-xl font-bold text-emerald-400">
                                +14.2%
                             </div>
                        </div>
                     </div>
                )}
            </div>

            {/* Mobile Bio */}
             {profile.bio && (
                 <p className="text-gray-400 text-sm mt-4 md:hidden leading-relaxed border-t border-gray-800/50 pt-4">
                     {profile.bio}
                 </p>
             )}
        </div>
    );
}
