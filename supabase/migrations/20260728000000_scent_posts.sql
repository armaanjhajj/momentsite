-- ============================================================
-- The MSI board
--
-- Backs /scent and /msi. Someone describes a smell they remember,
-- the site works out where that sits in odor space, and the memory
-- is filed under the zone it landed in. Zones accumulate forever,
-- so /msi/1347 is a permanent address with a growing wall of
-- memories behind it.
--
-- Unlike waitlist / inquiries / survey_responses, this table IS
-- publicly readable. That is the whole feature: a board nobody can
-- read is not a board. Writes are the opposite, and are locked
-- down hard (see the policies at the bottom).
-- ============================================================

create table if not exists public.scent_posts (
  id          uuid primary key default gen_random_uuid(),

  -- What the person wrote. The whole point of the post.
  memory      text not null,
  -- The text they actually searched, captured automatically. Usually
  -- shorter than the memory and sometimes identical to it.
  query       text not null,

  -- Where it landed. Derived server-side from the descriptor profile,
  -- never accepted from the browser, so a post's address always agrees
  -- with its contents.
  sense       smallint not null default 1,
  zone        smallint not null,
  -- 1000 * sense + zone, the number you would say out loud. Generated
  -- rather than stored twice, so the two can never disagree.
  code        integer generated always as (sense * 1000 + zone) stored,
  region      text not null,
  sub         text not null,

  -- The descriptor profile, {descriptor: weight}. What the polygon draws.
  profile     jsonb not null default '{}'::jsonb,
  -- The nearest aroma molecules, [{id, name, score}]. Denormalised on
  -- purpose: the curated set can change underneath and a post should
  -- keep showing what it actually matched on the day it was written.
  molecules   jsonb not null default '[]'::jsonb,

  -- The unit-normalised position in the 48 dimensional embedding. This
  -- is what makes "closest to yours" possible at all, and it is the one
  -- column a chronological board would not need.
  vec         real[] not null,

  created_at  timestamptz not null default now(),

  constraint scent_posts_memory_len check (char_length(memory) between 2 and 600),
  constraint scent_posts_query_len  check (char_length(query)  between 1 and 200),
  constraint scent_posts_sense_rng  check (sense between 1 and 5),
  constraint scent_posts_zone_rng   check (zone between 0 and 999),
  constraint scent_posts_vec_dim    check (array_length(vec, 1) = 48)
);

-- Recent, plain, for browsing.
create index if not exists scent_posts_created_at_idx
  on public.scent_posts (created_at desc);

-- Zone pages. Newest first inside a zone.
create index if not exists scent_posts_code_idx
  on public.scent_posts (code, created_at desc);

-- ============================================================
-- How many memories live in each zone
--
-- A view rather than a client-side count, so /msi can rank a
-- thousand zones without shipping a thousand rows. security_invoker
-- makes it obey the caller's RLS instead of the definer's, which is
-- the honest default even though reads here are public anyway.
-- ============================================================

create or replace view public.scent_zone_counts
with (security_invoker = true) as
  select
    code,
    sense,
    zone,
    -- Region names are a property of the zone, so any row in it will do.
    (array_agg(region order by created_at desc))[1] as region,
    (array_agg(sub    order by created_at desc))[1] as sub,
    count(*)::int  as posts,
    max(created_at) as latest
  from public.scent_posts
  group by code, sense, zone;

-- ============================================================
-- Closest to yours
--
-- Vectors are unit-normalised before they are stored, so cosine
-- similarity is just the dot product and needs no extension. This is
-- a sequential scan by design: it is exact, it has no index to fall
-- out of date, and at board scale (thousands, not millions) it costs
-- microseconds. If this table ever reaches millions of rows, swap the
-- body for pgvector and an ivfflat index; the signature stays.
-- ============================================================

create or replace function public.scent_dot(a real[], b real[])
returns double precision
language sql
immutable
parallel safe
set search_path = ''
as $$
  select coalesce(sum(x::double precision * y::double precision), 0)
  from unnest(a, b) as t(x, y);
$$;

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

-- ============================================================
-- Row level security
--
-- Read: open to everyone. It is a public board.
-- Write: nobody, through the anon key. Posting goes through
--        /api/scent/post, which recomputes the zone, region and
--        vector from the descriptor profile using the service-role
--        key. If the browser could insert directly it could file a
--        memory under any address it liked, and every number on the
--        page would become a claim rather than a measurement.
-- ============================================================

alter table public.scent_posts enable row level security;

drop policy if exists "Anyone can read the board" on public.scent_posts;
create policy "Anyone can read the board"
  on public.scent_posts for select
  using (true);

drop policy if exists "No anon writes to the board" on public.scent_posts;
create policy "No anon writes to the board"
  on public.scent_posts for insert
  with check (false);

grant select on public.scent_zone_counts to anon, authenticated;
grant execute on function public.scent_nearest(real[], int, uuid) to anon, authenticated;
grant execute on function public.scent_dot(real[], real[]) to anon, authenticated;
