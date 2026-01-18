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
            citation_url: string;
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
    agent_logs?: Array<{
        node: string;
        type: string;
        message: string;
        timestamp: string;
        emoji?: string;
    }>;
}

export async function fetchRebalanceStream(
    topic: string,
    description: string,
    onLog: (log: any) => void
): Promise<RebalanceResponse | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/rebalance/`, {
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

        if (!response.body) return null;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalResult: RebalanceResponse | null = null;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Process lines (SSE format: "data: ...\n\n")
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || ''; // Keep partial chunk

            for (const part of parts) {
                if (part.startsWith('data: ')) {
                    try {
                        const jsonStr = part.slice(6);
                        const event = JSON.parse(jsonStr);

                        if (event.type === 'log') {
                            onLog(event.content);
                        } else if (event.type === 'result') {
                            finalResult = event.payload;
                        } else if (event.type === 'error') {
                            console.error("Stream Error:", event.message);
                        }
                    } catch (e) {
                        console.error("Error parsing stream chunk", e);
                    }
                }
            }
        }

        return finalResult;

    } catch (error) {
        console.error("Failed to fetch rebalance:", error);
        return null;
    }
}
