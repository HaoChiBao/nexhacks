-- Add portfolio column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS portfolio JSONB DEFAULT '[]'::jsonb;

-- Populate with test data for ALL profiles (for development simplicity)
-- In production, you would only update specific users or inserting on purchase.
UPDATE public.profiles
SET portfolio = '[
    {
        "fund_id": "tariff-tracker", 
        "invested_amount": 4250.00,
        "pnl_percent": 12.5, 
        "purchase_date": "2024-01-15T10:00:00Z"
    },
    {
        "fund_id": "musk-meter",
        "invested_amount": 2800.00,
        "pnl_percent": 8.2,
        "purchase_date": "2024-01-10T14:30:00Z"
    },
    {
        "fund_id": "earthquake-watch",
        "invested_amount": 1500.00,
        "pnl_percent": -4.5,
        "purchase_date": "2024-01-18T09:15:00Z"
    }
]'::jsonb;

-- Note: valid fund_ids in your DB seem to be slugs like 'tariff-track', 'musk-met', 'earthquake'.
-- Please ensuring the "fund_id"s above strictly match the "id" column in your "funds" table.
-- You can verify with: SELECT id FROM funds;

-- Run this to update specific text tokens if needed to match your real IDs
-- Example correction if IDs are slightly different:
/*
UPDATE public.profiles
SET portfolio = jsonb_set(
    portfolio, 
    ''{0, fund_id}'', 
    ''"tariff-track-123"''
)
WHERE ...
*/
