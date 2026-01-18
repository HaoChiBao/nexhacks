import { MarketLine } from "../types/market-line";

export function toMarketLine(input: any): MarketLine {
    // 1. Identify if it's already close to Actual
    // Actual has marketId, slug, expiryDate, url
    const isActual = input.marketId && input.slug && input.expiryDate;

    if (isActual) {
        // Just fill safe defaults if missing
        return {
            ...input,
            id: input.id || input.marketId,
            meta: input.meta || {},
            liquidity: input.liquidity || 0,
            marketVolume: input.marketVolume || 0,
            ticker: input.ticker || "POLY",
            prob: input.prob ?? Math.round((input.lastPrice || 0) * 100),
            name: input.name || input.question,
            description: input.description || input.question,
            weightPct: input.weightPct ?? input.targetWeight ?? 0,
            targetWeight: input.targetWeight ?? 0
        } as MarketLine;
    }

    // 2. It's Test/Legacy data
    // Input Fields: name, prob, side, expiry, ticker, rationale, allocation, description
    
    // Derived IDs
    const safeName = input.name || "Unknown Market";
    const slug = input.slug || safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const marketId = input.id || `TEST-${Math.abs(hashString(slug)).toString(16).substring(0,6)}`;
    
    // Derived Dates
    const expiryDate = input.expiryDate || deriveIsoDate(input.expiry);
    
    // Derived Metrics
    // Test data often has prob as 0-100 (e.g. 45)
    // Actual expects lastPrice as 0.45
    let rawProb = input.prob ?? 50;
    let lastPrice = input.lastPrice;
    
    if (lastPrice === undefined) {
        // Assume input.prob is 0-100
        lastPrice = rawProb / 100;
    } else {
        // If lastPrice exists, ensure prob matches
        rawProb = lastPrice * 100;
    }

    // Derived Weights
    const allocation = input.allocation ?? input.targetWeight ?? 0;
    
    return {
        // IDs
        marketId,
        id: marketId,
        slug,
        url: input.url || `https://polymarket.com/market/${slug}`,
        asset_id: null,
        source: input.source || "Test",
        
        // Content
        name: safeName,
        question: input.question || safeName,
        description: input.description || safeName,
        ticker: input.ticker || slug.split('-')[0].toUpperCase(),
        rationale: input.rationale || input.reasoning,
        reasoning: input.rationale || input.reasoning,
        
        // Market Data
        side: input.side || input.outcome || "YES",
        outcome: input.side || input.outcome || "YES",
        prob: rawProb,
        lastPrice: lastPrice,
        liquidity: input.liquidity || 0,
        marketVolume: input.marketVolume || input.volume || 0,
        
        // Dates
        expiry: input.expiry || "Dec 31", // Keep original string 
        expiryDate: expiryDate,
        
        // Portfolio
        targetWeight: allocation,
        weightPct: allocation, // Initial assumption
        allocation: allocation,
        
        // Meta
        meta: input.meta || {},
        tags: input.tags || [],
        cluster: input.cluster || null,
        locked: input.locked || false
    };
}

// Helpers
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; 
    }
    return hash;
}

function deriveIsoDate(expiryStr?: string): string {
    if (!expiryStr) return "2025-12-31";
    // Naive mapping for "Dec 31" -> current year
    const currentYear = new Date().getFullYear();
    const date = new Date(`${expiryStr} ${currentYear}`);
    if (isNaN(date.getTime())) return "2025-12-31";
    return date.toISOString().split('T')[0];
}
