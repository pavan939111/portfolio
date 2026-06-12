-- 1. Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- 2. Create Portfolio Chunks Table
create table if not exists public.portfolio_chunks (
  id bigserial primary key,
  section text not null check (section in ('about', 'skills', 'projects', 'experience', 'education', 'faq', 'contact', 'achievements')),
  title text not null unique, -- Added unique constraint for upsert conflict resolution
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(1024) not null, -- Voyage AI dimension size
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- If you have already created the table without the unique constraint, run this:
-- alter table public.portfolio_chunks add constraint portfolio_chunks_title_key unique (title);

-- If you have already created the table without 'achievements' in the constraint, run this:
-- alter table public.portfolio_chunks drop constraint if exists portfolio_chunks_section_check;
-- alter table public.portfolio_chunks add constraint portfolio_chunks_section_check check (section in ('about', 'skills', 'projects', 'experience', 'education', 'faq', 'contact', 'achievements'));

-- 3. Create match_chunks function for cosine similarity search
create or replace function public.match_chunks (
  query_embedding vector(1024),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  section text,
  title text,
  content text,
  similarity float
)
language plpgsql stable
as $$
begin
  return query
  select
    pc.id,
    pc.section,
    pc.title,
    pc.content,
    (1 - (pc.embedding <=> query_embedding))::float as similarity
  from public.portfolio_chunks pc
  where (1 - (pc.embedding <=> query_embedding)) > match_threshold
  order by pc.embedding <=> query_embedding -- Distance operator ascending = Similarity descending
  limit match_count;
end;
$$;

-- 4. Create Row Level Security policies
alter table public.portfolio_chunks enable row level security;

-- Allow public read access (select)
drop policy if exists "Allow public read access to portfolio_chunks" on public.portfolio_chunks;
create policy "Allow public read access to portfolio_chunks" 
  on public.portfolio_chunks for select using (true);

-- No public write access (insert, update, delete) is allowed by default, 
-- but we explicitly define read-only configuration by not creating write policies.

-- 5. Create indexes
-- ivfflat index on embedding column for fast cosine distance search
-- Note: lists=100 is chosen as a standard default for small-to-medium datasets.
create index if not exists portfolio_chunks_embedding_ivfflat_idx 
  on public.portfolio_chunks 
  using ivfflat (embedding vector_cosine_ops) 
  with (lists = 100);

-- 6. Create Agent Runs / Telemetry Table
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
