-- Enable RLS on funds table (if not already)
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Public read access for funds" ON funds;

-- Create policy to allow basic read access to everyone (anon included)
CREATE POLICY "Public read access for funds"
ON funds
FOR SELECT
TO public
USING (true);

-- Ensure profiles is publicly readable if needed for 'created_by' joins, 
-- though usually basic profile info should be public.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for profiles" ON profiles;
CREATE POLICY "Public read access for profiles"
ON profiles
FOR SELECT
TO public
USING (true);
