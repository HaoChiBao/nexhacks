export interface RebalanceResponse {
    recommendation: string;
    plan: {
        targets: Array<{
            market_id: string;
            question?: string;
            event_title?: string;
            market_slug?: string;
            outcome: string;
            weight: number;
            rationale: string;
            citation_url?: string;
            volume_usd?: number;
            liquidity_usd?: number;
            last_price?: number;
        }>;
        warnings: string[];
    };
    research: {
        summary: string;
        evidence_items: Array<{ title: string; url: string }>;
    };
}

export async function fetchRebalance(topic: string, description: string): Promise<RebalanceResponse | null> {
    try {
        const response = await fetch("http://localhost:8000/rebalance/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                topic: topic,
                description: description,
                user_id: "client_user_1"
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch rebalance:", error);
        return null;
    }
}
