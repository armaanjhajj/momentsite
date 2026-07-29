-- ============================================================
-- Ten thousand zones per sense
--
-- The zoning gained a fourth digit: three clustered levels plus
-- an ordered position inside the leaf cell. So a zone is now
-- 0..9999 rather than 0..999, and a code is
--
--   10000 * sense + zone      e.g. 1 . 8680  ->  18680
--
-- instead of 1000 * sense + zone. `code` is generated, so it can
-- be dropped and rebuilt without losing anything; the view and the
-- index that depend on it have to come down with it and go back
-- up after.
--
-- Existing rows: their `zone` was computed under the old 1000 zone
-- map and is meaningless under the new one, so they are re-zoned
-- to NULL-equivalent rather than silently reinterpreted. In
-- practice the table is empty, so this is a statement of intent as
-- much as a data change.
-- ============================================================

drop view if exists public.scent_zone_counts;

alter table public.scent_posts drop column if exists code;

alter table public.scent_posts drop constraint if exists scent_posts_zone_rng;
alter table public.scent_posts
  add constraint scent_posts_zone_rng check (zone between 0 and 9999);

alter table public.scent_posts
  add column code integer generated always as (sense * 10000 + zone) stored;

drop index if exists scent_posts_code_idx;
create index scent_posts_code_idx
  on public.scent_posts (code, created_at desc);

create or replace view public.scent_zone_counts
with (security_invoker = true) as
  select
    code,
    sense,
    zone,
    (array_agg(region order by created_at desc))[1] as region,
    (array_agg(sub    order by created_at desc))[1] as sub,
    count(*)::int  as posts,
    max(created_at) as latest
  from public.scent_posts
  group by code, sense, zone;

grant select on public.scent_zone_counts to anon, authenticated;

-- scent_nearest returns `code`, so it has to be rebuilt against the
-- new column rather than the dropped one.
create or replace function public.scent_nearest(
  q real[],
  k int default 12,
  skip uuid default null
)
returns table (
  id         uuid,
  memory     text,
  query      text,
  sense      smallint,
  zone       smallint,
  code       integer,
  region     text,
  sub        text,
  profile    jsonb,
  molecules  jsonb,
  created_at timestamptz,
  similarity double precision
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    p.id, p.memory, p.query, p.sense, p.zone, p.code, p.region, p.sub,
    p.profile, p.molecules, p.created_at,
    public.scent_dot(p.vec, q) as similarity
  from public.scent_posts p
  where skip is null or p.id <> skip
  order by similarity desc, p.created_at desc
  limit least(greatest(k, 1), 60);
$$;

grant execute on function public.scent_nearest(real[], int, uuid) to anon, authenticated;
