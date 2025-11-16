-- Modify mixer01_rsvps table to support individual RSVPs
-- Drop old constraints and columns, add new fields for individual attendees

-- Drop the unique constraint on chapter_invite_code
alter table public.mixer01_rsvps drop constraint if exists mixer01_rsvps_chapter_invite_code_key;

-- Drop guest_count column (no longer needed)
alter table public.mixer01_rsvps drop column if exists guest_count;

-- Drop updated_by column (no longer needed)
alter table public.mixer01_rsvps drop column if exists updated_by;

-- Add new columns for individual RSVPs
alter table public.mixer01_rsvps add column if not exists name text not null default '';
alter table public.mixer01_rsvps add column if not exists email text not null default '';
alter table public.mixer01_rsvps add column if not exists favorite_color text;

-- Add unique constraint on (chapter_invite_code, email) to prevent duplicate RSVPs
drop index if exists idx_mixer01_rsvps_unique_email;
create unique index idx_mixer01_rsvps_unique_email on public.mixer01_rsvps(chapter_invite_code, email);

-- Update existing index
drop index if exists idx_mixer01_rsvps_invite_code;
create index if not exists idx_mixer01_rsvps_invite_code on public.mixer01_rsvps(chapter_invite_code);

-- Comments
comment on column public.mixer01_rsvps.name is 'Name of the person RSVPing';
comment on column public.mixer01_rsvps.email is 'Email of the person RSVPing (unique per chapter)';
comment on column public.mixer01_rsvps.favorite_color is 'Favorite color for event gifts/personalization';

