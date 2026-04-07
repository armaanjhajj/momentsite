-- Add generated insight columns to impulse table
-- Run this in the Supabase SQL editor

alter table public.impulse
  add column if not exists mbti_type text,
  add column if not exists synopsis text,
  add column if not exists team_color text,
  add column if not exists stats jsonb,
  add column if not exists insights_generated_at timestamptz;

-- Public read policy so any logged-in user can see another user's insights
-- when clicking the IMPULSE button on their profile
drop policy if exists "Impulse rows readable by self" on public.impulse;

create policy "Impulse insights readable by anyone"
  on public.impulse for select
  using (true);
