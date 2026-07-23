-- ============================================================
-- Survey questions v2
--
-- Reshapes survey_responses to the new question set on /survey:
--   1. find_people  - how you usually find people to hang out with
--   2. openness     - how open you are to meeting new people
--   3. would_go     - 1..5, would you go if someone new invited you
--   4. spot         - your "I know a spot" spot
-- The table has no meaningful data yet, so the old demo-feedback
-- columns are dropped and the new ones added.
-- ============================================================

alter table public.survey_responses
  drop column if exists rating,
  drop column if exists would_use,
  drop column if exists top_activity,
  drop column if exists favorite_part,
  drop column if exists what_would_open,
  drop column if exists how_meet_now;

alter table public.survey_responses
  add column if not exists find_people text,
  add column if not exists openness   text,
  add column if not exists would_go    smallint check (would_go between 1 and 5),
  add column if not exists spot        text;
