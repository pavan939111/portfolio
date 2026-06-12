-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- 1. Create Portfolio Items Table
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('project', 'experience', 'skill', 'about')),
  title text not null,
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security) - Read-only for anonymous users, admin can edit
alter table public.portfolio_items enable row level security;

create policy "Allow public read access to portfolio items" 
  on public.portfolio_items for select using (true);

-- 2. Create Portfolio Embeddings Table
create table if not exists public.portfolio_embeddings (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references public.portfolio_items(id) on delete cascade not null,
  content text not null,
  embedding vector(1024) not null, -- 1024 dimensions for Voyage-3 embeddings
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.portfolio_embeddings enable row level security;

create policy "Allow public read access to portfolio embeddings" 
  on public.portfolio_embeddings for select using (true);

-- 3. Create Agent Runs / Telemetry Table
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

create policy "Allow public read access to agent runs" 
  on public.agent_runs for select using (true);

create policy "Allow public insert access to agent runs" 
  on public.agent_runs for insert with check (true);

-- 4. Create Vector Similarity Match Function
create or replace function public.match_embeddings (
  query_embedding vector(1024),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  item_id uuid,
  content text,
  similarity float,
  category text,
  title text,
  description text,
  metadata jsonb
)
language plpgsql stable
as $$
begin
  return query
  select
    pe.id,
    pe.item_id,
    pe.content,
    1 - (pe.embedding <=> query_embedding) as similarity,
    pi.category,
    pi.title,
    pi.description,
    pi.metadata
  from public.portfolio_embeddings pe
  join public.portfolio_items pi on pe.item_id = pi.id
  where 1 - (pe.embedding <=> query_embedding) > match_threshold
  order by pe.embedding <=> query_embedding
  limit match_count;
end;
$$;
