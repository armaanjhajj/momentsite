-- Waitlist table for email collection
-- Run in Supabase SQL editor

create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamptz default now()
);

alter table public.waitlist enable row level security;

-- Anyone can join the waitlist (anon inserts)
create policy "Anyone can join the waitlist"
  on public.waitlist for insert
  with check (true);

-- No one can read the waitlist through the anon key
create policy "Block anon reads of waitlist"
  on public.waitlist for select
  using (false);
