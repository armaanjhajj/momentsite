-- ============================================================
-- Moments site database setup
-- Run this once in the new project's Supabase SQL editor.
--
-- The site needs exactly two tables:
--   1. waitlist   - emails of interested people
--   2. inquiries  - contact form submissions
--
-- This script wipes any old tables first, then recreates both
-- from scratch. Safe to re-run.
-- ============================================================

-- ── Clean slate ──────────────────────────────────────────────
-- Drop EVERY table in the public schema (and any views), so all the
-- leftover tables from the old project are wiped no matter what they
-- are named. The two tables we want are recreated right below.
do $$
declare obj record;
begin
  for obj in
    select table_name, table_type
    from information_schema.tables
    where table_schema = 'public'
  loop
    if obj.table_type = 'VIEW' then
      execute 'drop view if exists public.' || quote_ident(obj.table_name) || ' cascade';
    else
      execute 'drop table if exists public.' || quote_ident(obj.table_name) || ' cascade';
    end if;
  end loop;
end $$;

-- ── 1. Waitlist ──────────────────────────────────────────────
create table public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
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

-- ── 2. Inquiries (contact form) ──────────────────────────────
create table public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  message    text not null,
  created_at timestamptz default now(),
  -- At least one way to reach back: email or phone (matches the form)
  constraint inquiries_contact_present check (
    email is not null or phone is not null
  )
);

create index inquiries_created_at_idx
  on public.inquiries (created_at desc);

alter table public.inquiries enable row level security;

-- Anyone can submit an inquiry (anon inserts)
create policy "Anyone can submit an inquiry"
  on public.inquiries for insert
  with check (true);

-- No one can read inquiries through the anon key
create policy "Block anon reads of inquiries"
  on public.inquiries for select
  using (false);
