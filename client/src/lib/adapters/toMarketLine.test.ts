import { toMarketLine } from './toMarketLine';

describe('toMarketLine Adapter', () => {
    
    test('passes through Actual data safely', () => {
        const actual = {
            marketId: "123",
            slug: "test-slug",
            expiryDate: "2025-12-31",
            url: "https://poly.com/test",
            lastPrice: 0.55,
            question: "Is this real?",
            outcome: "YES"
        };
        
        const result = toMarketLine(actual);
        expect(result.marketId).toBe("123");
        expect(result.prob).toBe(55); // Derived fallback
        expect(result.name).toBe("Is this real?");
    });

    test('adapts Legacy/Test data correctly', () => {
        const legacy = {
            name: "Test Market",
            prob: 45, // 0-100
            side: "NO",
            expiry: "Dec 31",
            ticker: "TEST",
            allocation: 20
        };

        const result = toMarketLine(legacy);
        
        // IDs
        expect(result.slug).toBe("test-market");
        expect(result.marketId).toMatch(/^TEST-/);
        
        // Metrics
        expect(result.prob).toBe(45);
        expect(result.lastPrice).toBe(0.45); // Derived
        expect(result.weightPct).toBe(20);
        
        // Content
        expect(result.rationale).toBeUndefined(); // Extra fields ignored
        expect(result.ticker).toBe("TEST");
        expect(result.outcome).toBe("NO");
        expect(result.side).toBe("NO");
        
        // Dates
        expect(result.expiry).toBe("Dec 31");
        expect(result.expiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/); // ISO-like
    });

    test('handles missing probability', () => {
        const legacy = { name: "No Prob" };
        const result = toMarketLine(legacy);
        expect(result.prob).toBe(50);
        expect(result.lastPrice).toBe(0.5);
    });

    test('handles percentage-like lastPrice in test data', () => {
        // Some test data might be mixed up
        const mixed = { 
            name: "Mixed",
            lastPrice: 0.88 // 0.88
        };
        const result = toMarketLine(mixed);
        expect(result.prob).toBe(88);
    });
});
