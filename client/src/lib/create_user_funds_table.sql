-- Create a table for user-saved funds/strategies
create table user_funds (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  allocation_plan jsonb, -- Stores the strategy nodes/edges or targets
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies
alter table user_funds enable row level security;

create policy "Users can view their own funds." on user_funds
  for select using (auth.uid() = user_id);

create policy "Users can insert their own funds." on user_funds
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own funds." on user_funds
  for update using (auth.uid() = user_id);

create policy "Users can delete their own funds." on user_funds
  for delete using (auth.uid() = user_id);
