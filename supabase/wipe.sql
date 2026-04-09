-- ⚠️ DESTRUCTIVE: wipes all test data from the app tables
-- Run in Supabase SQL editor. This cannot be undone.
--
-- This deletes:
--   - all rows in public.users (cascades to user_taste, impulse, event_rsvps)
--   - all rows in public.waitlist
--   - all auth.users rows (so phone numbers are freed up for re-signup)
--   - all files in the avatars storage bucket
--
-- It does NOT touch:
--   - schema (tables, policies, functions stay intact)
--   - the events table if you have one
--   - any other buckets

-- 1. Wipe app data. public.users has ON DELETE CASCADE to the child tables,
-- but we delete them explicitly first for safety in case the FKs change.
delete from public.event_rsvps;
delete from public.user_taste;
delete from public.impulse;
delete from public.users;
delete from public.waitlist;

-- 2. Wipe auth.users so phone numbers are freed up. This also cascades to
-- public.users via the existing FK if anything was missed above.
delete from auth.users;

-- 3. Wipe all avatar uploads from storage.
delete from storage.objects where bucket_id = 'avatars';
