-- Allow anonymous users to read public profile fields
-- Run this in the Supabase SQL editor

create policy "Public profiles are readable by anyone"
  on public.users
  for select
  using (true);
