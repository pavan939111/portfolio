-- 1. Create Agent Runs / Telemetry Table
create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_query text not null,
  agent_thoughts jsonb default '[]'::jsonb,
  final_response text not null,
  tokens_used integer default 0 not null,
  latency_ms integer default 0 not null,
  cost_usd numeric(8, 6) default 0.000000 not null,
  tools_called text[] default '{}'::text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS - Allow public inserts (so visitors' agent runs log) and public reads for dashboard
alter table public.agent_runs enable row level security;

drop policy if exists "Allow public read access to agent runs" on public.agent_runs;
create policy "Allow public read access to agent runs" 
  on public.agent_runs for select using (true);

drop policy if exists "Allow public insert access to agent runs" on public.agent_runs;
create policy "Allow public insert access to agent runs" 
  on public.agent_runs for insert with check (true);

-- 7. Create Contact Messages Table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Allow public insert access so visitors can submit the contact form
drop policy if exists "Allow public insert access to contact_messages" on public.contact_messages;
create policy "Allow public insert access to contact_messages" 
  on public.contact_messages for insert with check (true);

