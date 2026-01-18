export interface UserProfile {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string;
    bio?: string;
    joinedAt?: string;
    isPublic?: boolean;
}

export interface FundInvestment {
    fundId: string;
    fundName: string;
    fundCategory: string;
    investedPm: number;
    currentNavPm: number;
    return30dPct: number;
    hedgedPct?: number;
    topMarkets?: { title: string; outcome: "YES" | "NO"; priceCents: number }[];
}

export interface UserPortfolioSnapshot {
    userId: string;
    totalInvestedPm: number;
    totalNavPm: number;
    fundsCount: number;
    investments: FundInvestment[];
    updatedAt: string;
}

const MOCK_USERS: UserProfile[] = [
    {
        id: "u_123",
        name: "James Bond",
        handle: "007",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        bio: "Quantitative strategies for high-stakes geopolitical events.",
        joinedAt: "2024-01-15",
        isPublic: true
    },
    {
        id: "u_456",
        name: "Alice Chen",
        handle: "alice_c",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        bio: "Focusing on AI safety and bioresearch markets.",
        joinedAt: "2024-03-10",
        isPublic: true
    }
];

const MOCK_PORTFOLIOS: Record<string, UserPortfolioSnapshot> = {
    "u_123": {
        userId: "u_123",
        totalInvestedPm: 12500,
        totalNavPm: 14250,
        fundsCount: 3,
        updatedAt: new Date().toISOString(),
        investments: [
            {
                fundId: "f_1",
                fundName: "Global Macro 2024",
                fundCategory: "Macro",
                investedPm: 5000,
                currentNavPm: 5800,
                return30dPct: 16.0,
                hedgedPct: 12,
                topMarkets: [
                    { title: "Fed Cuts Rates in Q3", outcome: "YES", priceCents: 65 },
                    { title: "Oil > $90 in 2024", outcome: "NO", priceCents: 40 }
                ]
            },
            {
                fundId: "f_2",
                fundName: "AI Accelerate",
                fundCategory: "Tech",
                investedPm: 4000,
                currentNavPm: 4950,
                return30dPct: 23.75,
                topMarkets: [
                    { title: "GPT-5 Release 2024", outcome: "NO", priceCents: 85 }
                ]
            },
            {
                fundId: "f_3",
                fundName: "Election Hedge",
                fundCategory: "Politics",
                investedPm: 3500,
                currentNavPm: 3500,
                return30dPct: 0.0,
                hedgedPct: 100,
                topMarkets: [
                    { title: "US Pres Election Winner", outcome: "YES", priceCents: 50 }
                ]
            }
        ]
    },
    "u_456": {
        userId: "u_456",
        totalInvestedPm: 2000,
        totalNavPm: 2100,
        fundsCount: 1,
        updatedAt: new Date().toISOString(),
        investments: [
            {
                fundId: "f_10",
                fundName: "BioHealth Moonshots",
                fundCategory: "Bio",
                investedPm: 2000,
                currentNavPm: 2100,
                return30dPct: 5.0,
                topMarkets: [
                    { title: "CRISPR Therapy Approval", outcome: "YES", priceCents: 78 }
                ]
            }
        ]
    }
};

export function getUserProfile(userId: string): UserProfile | null {
    return MOCK_USERS.find(u => u.id === userId) || null;
}

export function getUserPortfolio(userId: string): UserPortfolioSnapshot | null {
    return MOCK_PORTFOLIOS[userId] || null;
}
