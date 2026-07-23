-- ============================================================
-- Survey responses (MOMENTS demo feedback survey)
--
-- Backs the /survey page: visitors watch the interactive demo,
-- answer a short set of questions, and submit. Follows the same
-- anon-insert / no-anon-read pattern as waitlist + inquiries, so
-- responses are readable only through the service-role key on the
-- gated /admin dashboard.
-- ============================================================

create table if not exists public.survey_responses (
  id              uuid primary key default gen_random_uuid(),
  -- 1..5 overall impression of the demo
  rating          smallint check (rating between 1 and 5),
  -- 'yes' | 'maybe' | 'no' — would you use MOMENTS
  would_use       text,
  -- which activity they'd drop first (hoop / food / study / other label)
  top_activity    text,
  -- free-text answers
  favorite_part   text,
  what_would_open text,
  how_meet_now    text,
  -- optional so we can follow up
  email           text,
  created_at      timestamptz default now()
);

create index if not exists survey_responses_created_at_idx
  on public.survey_responses (created_at desc);

alter table public.survey_responses enable row level security;

-- Anyone can submit a survey response (anon inserts)
drop policy if exists "Anyone can submit a survey response" on public.survey_responses;
create policy "Anyone can submit a survey response"
  on public.survey_responses for insert
  with check (true);

-- No one can read survey responses through the anon key
drop policy if exists "Block anon reads of survey responses" on public.survey_responses;
create policy "Block anon reads of survey responses"
  on public.survey_responses for select
  using (false);
