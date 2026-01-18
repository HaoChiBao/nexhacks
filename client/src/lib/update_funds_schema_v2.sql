-- Comprehensive update for funds table to support full generation data
-- Run this in Supabase SQL Editor

-- 1. Ensure basic ownership columns exist
ALTER TABLE public.funds 
ADD COLUMN IF NOT EXISTS created_by text DEFAULT 'Anonymous';

ALTER TABLE public.funds 
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);

-- 2. Add columns for Generated Artifacts (Reports)
ALTER TABLE public.funds
ADD COLUMN IF NOT EXISTS description text,     -- Short description metadata
ADD COLUMN IF NOT EXISTS report_markdown text, -- Full markdown report
ADD COLUMN IF NOT EXISTS report_pdf text,      -- URL or Base64 of PDF
ADD COLUMN IF NOT EXISTS proposal_json jsonb;  -- The raw agent proposal

-- 3. Add columns for extra metadata
ALTER TABLE public.funds
ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb; -- e.g. ["Finance", "Macro"]

ALTER TABLE public.funds
ADD COLUMN IF NOT EXISTS volume numeric DEFAULT 0; -- Initial volume

-- 3b. Add missing financial metrics (if table was created with older schema)
ALTER TABLE public.funds
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Live',
ADD COLUMN IF NOT EXISTS returns_month numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS returns_inception numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS liquidity_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_drawdown numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS top_concentration numeric DEFAULT 0;

-- 4. Update RLS policies to ensure inserts/updates work for EVERYONE (Guests + Users)
DROP POLICY IF EXISTS "Users can insert their own funds" ON public.funds;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.funds;

CREATE POLICY "Enable insert for all users" 
ON public.funds 
FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can update their own funds" ON public.funds;
CREATE POLICY "Owners can update their own funds" 
ON public.funds 
FOR UPDATE
USING (auth.uid() = owner_id);

-- 5. Grant access (just in case)
GRANT ALL ON public.funds TO authenticated;
GRANT ALL ON public.funds TO anon;
