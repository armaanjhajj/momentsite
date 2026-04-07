-- Event RSVPs with one-per-user constraint
-- Run in Supabase SQL editor

create table if not exists public.event_rsvps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  event_slug text not null,
  status text not null check (status in ('going', 'maybe')),
  group_type text not null check (group_type in ('solo', 'group')),
  song_requests jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, event_slug)
);

create index if not exists event_rsvps_event_slug_idx on public.event_rsvps(event_slug);

alter table public.event_rsvps enable row level security;

create policy "RSVPs readable by everyone"
  on public.event_rsvps for select
  using (true);

create policy "Users can insert their own RSVPs"
  on public.event_rsvps for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own RSVPs"
  on public.event_rsvps for update
  using (auth.uid() = user_id);

create policy "Users can delete their own RSVPs"
  on public.event_rsvps for delete
  using (auth.uid() = user_id);
