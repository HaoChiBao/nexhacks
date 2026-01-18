-- SQL script to update the 'funds' table with richer holdings data.
-- Targets the specific IDs/slugs found in your existing Supabase database.

-- 1. Tariff Tracker (id starts with 'tariff-track')
UPDATE funds
SET holdings = '[
       {"name": "China EV Tax", "ticker": "CN-EV", "side": "YES", "allocation": 40, "prob": 75, "expiry": "Dec 31", "description": "US imposes >25% tariffs on Chinese electric vehicle imports.", "rationale": "Bipartisan support for protecting domestic auto industry."},
       {"name": "Steel Tariffs", "ticker": "STEEL", "side": "YES", "allocation": 30, "prob": 60, "expiry": "Nov 5", "description": "Re-implementation of Section 232 steel tariffs.", "rationale": "Rust belt polling numbers driving protectionist trade policy."},
       {"name": "EU Trade Deal", "ticker": "EU-DEAL", "side": "NO", "allocation": 30, "prob": 20, "expiry": "Oct 1", "description": "New comprehensive digital trade agreement with EU.", "rationale": "Regulatory divergence on AI and privacy stalling negotiations."}
    ]'::jsonb
WHERE id LIKE 'tariff-track%';

-- 2. Rate Cut Logic (id starts with 'rate-cuts')
UPDATE funds
SET holdings = '[
        {"name": "Fed Cut Sept", "ticker": "FED-SEP", "side": "YES", "allocation": 50, "prob": 85, "expiry": "Sep 18", "description": "Federal Reserve cuts rates by at least 25bps in September.", "rationale": "Inflation cooling to 2.9% and softening labor market signals."},
        {"name": "ECB Cut", "ticker": "ECB-OCT", "side": "YES", "allocation": 25, "prob": 70, "expiry": "Oct 17", "description": "European Central Bank lowers deposit facility rate.", "rationale": "Eurozone growth stagnation requires monetary stimulus."},
        {"name": "BoJ Hike", "ticker": "BOJ-DEC", "side": "NO", "allocation": 25, "prob": 40, "expiry": "Dec 19", "description": "Bank of Japan raises rates again in 2024.", "rationale": "Recent market volatility makes further tightening unlikely this year."}
    ]'::jsonb
WHERE id LIKE 'rate-cuts%';

-- 3. Musk Meter (id starts with 'musk-met')
UPDATE funds
SET holdings = '[
        {"name": "Tesla > $300", "ticker": "TSLA", "side": "YES", "allocation": 45, "prob": 55, "expiry": "Dec 31", "description": "Tesla stock price closes above $300.", "rationale": "Robotaxi unveil event expected to drive significant momentum."},
        {"name": "Twitter Payment", "ticker": "X-PAY", "side": "YES", "allocation": 35, "prob": 30, "expiry": "Dec 31", "description": "X (Twitter) launches P2P payments in US.", "rationale": "License acquisitions in multiple states suggest imminent launch."},
        {"name": "Grok 3 Release", "ticker": "GROK", "side": "YES", "allocation": 20, "prob": 80, "expiry": "Nov 1", "description": "xAI releases Grok 3 model to public.", "rationale": "Compute cluster expansion timeline aligns with Q4 release."}
    ]'::jsonb
WHERE id LIKE 'musk-met%';

-- 4. Bank Stress (id starts with 'bank-stress')
UPDATE funds
SET holdings = '[
         {"name": "Regional Default", "ticker": "REG-FAIL", "side": "YES", "allocation": 50, "prob": 45, "expiry": "Dec 31", "description": "At least one US regional bank enters FDIC receivership.", "rationale": "CRE exposure remains a systemic risk for balance sheets."},
         {"name": "Basel III Endgame", "ticker": "BASEL", "side": "NO", "allocation": 30, "prob": 65, "expiry": "Nov 1", "description": "Full implementation of Basel III capital requirements.", "rationale": "Strong bank lobby pushback likely to water down final rules."},
         {"name": "Discount Window", "ticker": "DW-USE", "side": "YES", "allocation": 20, "prob": 80, "expiry": "Dec 31", "description": "Emergency lending usage increases QoQ.", "rationale": "Liquidity constraints tightening as BTFP program effects fade."}
    ]'::jsonb
WHERE id LIKE 'bank-stress%';

-- 5. Esports Champ (id starts with 'sports-ch')
UPDATE funds
SET holdings = '[
        {"name": "T1 Worlds Win", "ticker": "T1-WIN", "side": "YES", "allocation": 40, "prob": 35, "expiry": "Nov 2", "description": "T1 wins the League of Legends World Championship.", "rationale": "Faker active form and roster synergy peaking at right time."},
        {"name": "G2 Make Semis", "ticker": "G2-SEMI", "side": "NO", "allocation": 35, "prob": 60, "expiry": "Oct 27", "description": "G2 Esports reaches semi-finals.", "rationale": "Strong competition from LPL/LCK teams reduces probability."},
        {"name": "CS2 Major Viewship", "ticker": "CS2-VIEW", "side": "YES", "allocation": 25, "prob": 90, "expiry": "Dec 15", "description": "Next Major breaks viewership records.", "rationale": "Counter-Strike 2 hype cycle driving casual engagement."}
    ]'::jsonb
WHERE id LIKE 'sports-ch%';

-- 6. Earthquake / Climate (id starts with 'earthquake')
UPDATE funds
SET holdings = '[
        {"name": "CA Quake > 5.0", "ticker": "CA-QK", "side": "YES", "allocation": 50, "prob": 40, "expiry": "Dec 31", "description": "Earthquake magnitude 5.0+ recorded in California.", "rationale": "Seismic activity on San Andreas fault within statistical range."},
        {"name": "Hurricane cat 4", "ticker": "HURR-4", "side": "YES", "allocation": 50, "prob": 70, "expiry": "Nov 30", "description": "Category 4+ hurricane makes US landfall.", "rationale": "Record ocean temps in Atlantic basin fuel storm intensity."}
    ]'::jsonb
WHERE id LIKE 'earthquake%';
