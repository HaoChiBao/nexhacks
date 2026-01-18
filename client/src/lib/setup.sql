-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  balance numeric default 10000.00,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, balance)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 10000.00);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create funds table
create table funds (
  id text primary key,
  name text not null,
  thesis text,
  secondary_thesis text,
  logo text,
  status text, -- 'Live', 'Backtest', 'Waitlist'
  returns_month numeric,
  returns_inception numeric,
  liquidity_score numeric,
  max_drawdown numeric,
  top_concentration numeric,
  sharpe numeric,
  nav numeric,
  aum numeric,
  holdings jsonb, -- Array of holding objects
  tags text[], -- Array of strings
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table funds enable row level security;

create policy "Funds are viewable by everyone." on funds
  for select using (true);


-- Insert Test Data (matching funds.ts)
insert into funds (id, name, thesis, secondary_thesis, logo, status, returns_month, returns_inception, liquidity_score, max_drawdown, top_concentration, sharpe, nav, aum, tags, holdings)
values
  (
    'alpha-flow',
    'Alpha Flow Strategy',
    'Macro Hedges',
    'Exploits short-term volatility in major political events.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDaH1D2k4xKxrOVqIQg0zYLkO2uHyZOsoRuuEBi4pjam4VIbdx94C6xitf0a3aTzk6TqONua-A43wkdoqJwq12IW12nUGF5tfXJ_f2h0uMrZol-TNlq-AlhsLAZeWTmTNoSLlv9wuLvgpJmPa68HzJbPIZEyGpRPwleU6tqT3w8dDwTzmF1jLnPZQmK1Z102iXF2E5tj_xfxDFXpMqncXQtGL_Qd0VbWnGnyydplrq2BewredhpnQXOYmVMBcgUD9NowTCvbk2oY3r6',
    'Live',
    4.5,
    24.5,
    98,
    -4.2,
    45,
    2.85,
    82,
    53.1,
    ARRAY['Politics', 'Macro'],
    '[
       {"name": "ETH ETF Approval", "ticker": "ETH ETF", "side": "YES", "allocation": 45, "prob": 68, "expiry": "Sep 18"},
       {"name": "SOL ETF Approval", "ticker": "SOL ETF", "side": "NO", "allocation": 30, "prob": 52, "expiry": "Nov 5"},
       {"name": "BTC > 70K", "ticker": "BTC > 70K", "side": "YES", "allocation": 15, "prob": 35, "expiry": "Dec 31"}
    ]'::jsonb
  ),
  (
    'election-oracle',
    'Election Oracle AI',
    'Predictive Model',
    'AI-driven sentiment analysis on US elections.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCkEtq4V3df9hHw8CZO8UBzyFtqFTGRmfMIfxzHqVJcpJQsEPQcN5_o0HFev8PGgViy1xKBlxg5hAWIPqx4CDP_f1TT1CFZhXG_s9w3V19PbWXf6ViQs6wNckQ1or2jzqpflECNXX3y4H2nFgRnC7fcQp_gmTKJuCHJcbppTzUzcM0-PRb-sqh7dlJnxco-PBx5VXg8IGVbDIY5vTpHCK5GbC8NVoMzmZX9Ywyvxps7_mylMFEG4SSXPKcFSE0DNHaPa8RE74TWDk6x',
    'Backtest',
    12.1,
    128,
    72,
    -12.5,
    60,
    null,
    null,
    null,
    ARRAY['AI', 'Election'],
    '[
        {"name": "Dem Senate Control", "ticker": "Dem Senate", "side": "YES", "allocation": 60, "prob": 45, "expiry": "Nov 5"},
        {"name": "GOP House Control", "ticker": "GOP House", "side": "YES", "allocation": 25, "prob": 55, "expiry": "Nov 5"},
        {"name": "Newsom Run 2028", "ticker": "Newsom 2028", "side": "YES", "allocation": 10, "prob": 20, "expiry": "Dec 31"}
    ]'::jsonb
  ),
  (
    'global-macro',
    'Global Macro Events',
    'Central Banks',
    'Trading interest rate probabilities worldwide.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBqZR3TeUh8FzIO-jSvqIefPGBkX5Wy9F_VxVi6fLFbuFEIuHZGtF3yWXR87dNY7aD65TggVwYb0Cd6uC4Ps0I_PCYqpZYO2mw_XuKjTgvHXLe636_PKhA_QBZTN7Jyo7LRNkmylz-iSglxxUhV973h3n5UfXrYAYwGivYetzUiir6_ntVOyEuxqctk7gYSztV0xMRUcoqLfz4IKeBYznwW0J5iuMqBrzcmMcvWmmXtLbyWORjihHOhhrjNO44obAouzG5gVwaoY1uv',
    'Waitlist',
    0,
    0,
    0,
    0,
    0,
    null,
    null,
    null,
    ARRAY['Macro', 'Rates'],
    '[
        {"name": "Fed Cut", "ticker": "Fed Cut", "side": "YES", "allocation": 50, "prob": 80, "expiry": "Sep 18"},
        {"name": "EU Inflation > 2%", "ticker": "EU CPI", "side": "YES", "allocation": 30, "prob": 60, "expiry": "Oct 1"},
        {"name": "Oil > 80", "ticker": "Oil > 80", "side": "YES", "allocation": 15, "prob": 40, "expiry": "Dec 1"}
    ]'::jsonb
  ),
  (
    'crypto-vol',
    'Crypto Volatility 2X',
    'Algo Trading',
    'Automated bets on crypto price milestones.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC7BTZq6vqRrre7IXYI-jUhrkJTjYmaTLPs_-fsqXpdTn1FuTt-zOBeflmcBB-mG4ctQNqo-d826sXIKtx6BqY_pPzXa1pvauQxi9uqVrYa2bwfMObMVrFqnm8XrF1gHfm_t8AiRfwlsrrPstJaHNhMc5jtaOiJpNaud5Pq3dwxEmtvdZ3e8bY7Tocq_LTF1u_9BQQtkKi4M4gHHPFLuD2ArvEFeVtmhri_cCENhNt3x8040f_JtrWcFi1fApIOFh_PrLrJpTqkYOrh',
    'Live',
    18.2,
    89.2,
    55,
    -15.8,
    55,
    null,
    null,
    null,
    ARRAY['Crypto', 'Algo'],
    '[
         {"name": "ETH > 3K", "ticker": "ETH > 3K", "side": "YES", "allocation": 55, "prob": 60, "expiry": "Dec 31"},
         {"name": "SOL > 150", "ticker": "SOL > 150", "side": "YES", "allocation": 35, "prob": 70, "expiry": "Dec 31"},
         {"name": "USDT De-peg", "ticker": "USDT De-peg", "side": "NO", "allocation": 5, "prob": 99, "expiry": "Dec 31"}
    ]'::jsonb
  ),
  (
    'sports-arb',
    'Sports Arbitrage',
    'Event Driven',
    'Capturing spreads across major sporting outcomes.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkJyXmRIc8n-V07EDcKCw1COdtDX4XWPIwQiqwVWuKKFeD0ZPG96euDoQvIMk2x477Vj2SH6nVGjd8F5_1SDcWk7oFAsmV6shIRlfUznzXfMcPkhxl-F-DYxWTzcqse4U-YfDXmwbArUEHLhI-zuO7gyHSjmgErPG7gZZK24vMBPhiF7VEgCd9Kp5Bq3bGc7yRQ2pzqSuHLiPZbUX22NsIoIK2v6qK9SzITJVwSM2WUxaUiAywu1pIgQzcvG5C649xy2H7Ab_btOu0',
    'Live',
    2.1,
    15.4,
    90,
    -1.2,
    40,
    null,
    null,
    null,
    ARRAY['Sports', 'Arb'],
    '[
        {"name": "KC Chiefs Win", "ticker": "KC Chiefs", "side": "YES", "allocation": 40, "prob": 60, "expiry": "Feb 11"},
        {"name": "Lakers Win", "ticker": "Lakers", "side": "YES", "allocation": 35, "prob": 55, "expiry": "Tonight"},
        {"name": "Man City Win", "ticker": "Man City", "side": "YES", "allocation": 20, "prob": 75, "expiry": "Saturday"}
    ]'::jsonb
  );
