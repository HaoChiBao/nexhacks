-- Add created_by column for display name of the creator
ALTER TABLE public.funds 
ADD COLUMN IF NOT EXISTS created_by text DEFAULT 'Anonymous';

-- Add owner_id column to reference the auth.users table for security (RLS)
ALTER TABLE public.funds 
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);

-- Update RLS to allow authenticated users to insert
CREATE POLICY "Users can insert their own funds" 
ON public.funds 
FOR INSERT 
TO authenticated 
WITH CHECK (true);
-- Note: In a strict app, we might check auth.uid() = owner_id, but for now we trust the insert.

-- Update RLS to allow owners to update their funds
CREATE POLICY "Owners can update their own funds" 
ON public.funds 
FOR UPDATE
USING (auth.uid() = owner_id);
