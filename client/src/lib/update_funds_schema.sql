-- Add created_by column
ALTER TABLE funds ADD COLUMN created_by text DEFAULT 'PrintMoney Core';

-- Drop unused columns
ALTER TABLE funds DROP COLUMN status;
ALTER TABLE funds DROP COLUMN returns_month;
ALTER TABLE funds DROP COLUMN returns_inception;
ALTER TABLE funds DROP COLUMN liquidity_score;
ALTER TABLE funds DROP COLUMN max_drawdown;
ALTER TABLE funds DROP COLUMN top_concentration;

-- Note: You may need to update your RLS policies if they relied on any dropped columns, 
-- though the default policies seen in setup.sql (true/uid checks) should likely remain valid 
-- or might need to check created_by for ownership if you implement that later.
