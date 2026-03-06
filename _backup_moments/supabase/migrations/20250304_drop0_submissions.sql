-- DROP 0 RSVP / glasses order submissions
-- Stores user submissions from the /0/flow page

create table if not exists public.drop0_submissions (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  message text not null check (char_length(message) <= 10),
  full_name text not null,
  address text not null,
  contact text not null,
  agreed_terms boolean not null default false,
  created_at timestamptz default now()
);

-- Index for lookups
create index if not exists idx_drop0_submissions_school on public.drop0_submissions(school);
create index if not exists idx_drop0_submissions_created on public.drop0_submissions(created_at);

-- RLS
alter table public.drop0_submissions enable row level security;

-- Allow inserts (public form submission)
drop policy if exists "Anyone can insert drop0 submissions" on public.drop0_submissions;
create policy "Anyone can insert drop0 submissions"
  on public.drop0_submissions for insert
  with check (true);

-- Allow reads (for admin / dashboard)
drop policy if exists "Anyone can view drop0 submissions" on public.drop0_submissions;
create policy "Anyone can view drop0 submissions"
  on public.drop0_submissions for select
  using (true);
