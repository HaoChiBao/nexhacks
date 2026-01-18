export interface MarketLine {
  // Canonical Fields (Actual)
  marketId: string;
  id: string; // Alias for marketId (for compatibility)
  slug: string;
  question: string;
  outcome?: string; // Derived from side if missing in Test
  side?: string;    // 'YES' or 'NO'
  source: string;   // 'Polymarket' | 'Test'
  url: string;

  // Pricing & Metrics
  lastPrice: number;        // Raw price (e.g. 0.45)
  prob: number;             // Scaled probability (0-100)
  liquidity: number;
  marketVolume: number;
  
  // Weights (Portfolio)
  targetWeight: number;     // 0-100
  weightPct: number;        // Normalized 0-100
  allocation?: number;      // Legacy support (same as targetWeight)

  // Dates
  expiryDate: string;       // ISO Date YYYY-MM-DD
  expiry?: string;          // Display string (e.g. "Dec 31") - kept for legacy UI support

  // Metadata / AI Fields
  ticker: string;
  name: string;             // Often same as question
  description: string;
  rationale?: string;
  reasoning?: string;       // Alias for rationale
  
  // Extra
  asset_id?: string | null;
  meta: Record<string, any>;
  
  // UI Helpers (Optional)
  cluster?: string | null;
  tags?: string[];
  locked?: boolean;
}
