-- Mixer01 RSVP table for Greek mixer event
-- Stores RSVP status for each chapter

create table if not exists public.mixer01_rsvps (
  id uuid primary key default gen_random_uuid(),
  chapter_invite_code text unique not null,
  status text not null check (status in ('pending', 'attending', 'maybe', 'declined')),
  guest_count integer check (guest_count in (1, 2)),
  updated_by text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Index for faster lookups by invite code
create index if not exists idx_mixer01_rsvps_invite_code on public.mixer01_rsvps(chapter_invite_code);

-- RLS: Anyone can read (public board), but only allow inserts/updates via API
alter table public.mixer01_rsvps enable row level security;

-- Allow anyone to read (for the public board)
drop policy if exists "Anyone can view RSVPs" on public.mixer01_rsvps;
create policy "Anyone can view RSVPs"
  on public.mixer01_rsvps for select
  using (true);

-- Allow inserts (for new RSVPs)
drop policy if exists "Anyone can insert RSVPs" on public.mixer01_rsvps;
create policy "Anyone can insert RSVPs"
  on public.mixer01_rsvps for insert
  with check (true);

-- Allow updates (for updating RSVP status)
drop policy if exists "Anyone can update RSVPs" on public.mixer01_rsvps;
create policy "Anyone can update RSVPs"
  on public.mixer01_rsvps for update
  using (true)
  with check (true);

-- Function to automatically update updated_at timestamp
create or replace function update_mixer01_rsvps_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at on row update
drop trigger if exists mixer01_rsvps_updated_at on public.mixer01_rsvps;
create trigger mixer01_rsvps_updated_at
  before update on public.mixer01_rsvps
  for each row
  execute function update_mixer01_rsvps_updated_at();

