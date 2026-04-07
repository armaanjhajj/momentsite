-- Impulse engine profile data
-- Run this in the Supabase SQL editor

create table if not exists public.impulse (
  user_id uuid primary key references public.users(id) on delete cascade,
  grad_year text,
  major text,
  vibes text[],
  interests text[],
  custom_interests text[],
  intents text[],
  pronouns text,
  relationship_status text,
  custom_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.impulse enable row level security;

create policy "Impulse rows readable by self"
  on public.impulse for select
  using (auth.uid() = user_id);

create policy "Users can insert their own impulse row"
  on public.impulse for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own impulse row"
  on public.impulse for update
  using (auth.uid() = user_id);

-- The users table already has an `embedding vector` column and an ivfflat index.
-- We reuse that for similarity search. Nothing to add there.
