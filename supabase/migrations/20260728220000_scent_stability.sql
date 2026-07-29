-- ============================================================
-- Making MSI codes stable
--
-- Two separate causes of instability, fixed together.
--
-- 1. THE MODEL IS ASKED THE SAME QUESTION TWICE.
--    /api/scent/decompose calls Claude on every search. Token spend
--    scales with repeats, and the same typed phrase can come back
--    with different weights on different days, which moves the code.
--    scent_decompositions memoises the answer on normalised query
--    text. First answer wins permanently: nothing overwrites a row,
--    so a phrase keeps the code it was first given.
--
-- 2. THE MAP MOVES UNDER STORED POSTS.
--    Growing the curated set from 152 to 157 re-fitted all 87
--    descriptor directions and changed where every query lands.
--    A post keeps the code it was written with, so it silently
--    becomes mis-filed. map_version records which map a row's
--    coordinates were computed under; scripts/rezone-posts.ts
--    recomputes them from the stored profile and restamps.
--
-- Plus scent_molecule_hits, so curation can follow real demand
-- instead of being written for molecules nobody reaches.
-- ============================================================

-- ── 1. the decomposition cache ───────────────────────────────

create table if not exists public.scent_decompositions (
  -- lowercased, trimmed, internal whitespace collapsed. The primary key IS
  -- the normalisation: two spellings that normalise alike share one answer.
  query_norm  text primary key,
  -- the first spelling seen, kept for display and for debugging what the
  -- normaliser actually collapsed.
  query_raw   text not null,
  profile     jsonb not null,
  -- 'lexicon' when the lexicon was confident enough to answer alone,
  -- 'model' when Claude supplied or completed the weights.
  source      text not null check (source in ('lexicon', 'model')),
  -- The identity card is also model output and also costs tokens. Without it
  -- cached, the route still calls Claude on every repeat and the cache saves
  -- nothing. Nullable because a lexicon-only answer has no identity.
  identity    jsonb,
  created_at  timestamptz not null default now(),

  constraint scent_decompositions_norm_len check (char_length(query_norm) between 1 and 200)
);

create index if not exists scent_decompositions_created_at_idx
  on public.scent_decompositions (created_at desc);

alter table public.scent_decompositions enable row level security;

drop policy if exists "Anyone can read decompositions" on public.scent_decompositions;
create policy "Anyone can read decompositions"
  on public.scent_decompositions for select
  using (true);

-- Writes go only through /api/scent/decompose, which holds the service-role
-- key. If the browser could insert, it could pin any phrase to any profile.
drop policy if exists "No anon writes to decompositions" on public.scent_decompositions;
create policy "No anon writes to decompositions"
  on public.scent_decompositions for insert
  with check (false);

-- ── 2. which map a post was filed under ──────────────────────

alter table public.scent_posts
  add column if not exists map_version text not null default 'unset';

create index if not exists scent_posts_map_version_idx
  on public.scent_posts (map_version);

comment on column public.scent_posts.map_version is
  'Content hash of the descriptor directions and zone tree in force when this '
  'row was written. Rows whose value differs from the current MAP_VERSION were '
  'placed by an older map and need scripts/rezone-posts.ts.';

-- ── 3. demand, so curation can follow it ─────────────────────

create table if not exists public.scent_molecule_hits (
  molecule_id text primary key,
  -- true when the molecule has a hand-written card (occurrences, fact,
  -- sourcing). The whole point of the table is finding the false ones with
  -- high counts.
  curated     boolean not null default false,
  hit_count   bigint not null default 0,
  last_hit_at timestamptz not null default now()
);

create index if not exists scent_molecule_hits_count_idx
  on public.scent_molecule_hits (hit_count desc);

alter table public.scent_molecule_hits enable row level security;

drop policy if exists "Anyone can read molecule hits" on public.scent_molecule_hits;
create policy "Anyone can read molecule hits"
  on public.scent_molecule_hits for select
  using (true);

drop policy if exists "No anon writes to molecule hits" on public.scent_molecule_hits;
create policy "No anon writes to molecule hits"
  on public.scent_molecule_hits for insert
  with check (false);

-- Counted server-side in one statement per search rather than one per
-- molecule. Upsert so a first sighting and a repeat take the same path.
create or replace function public.scent_bump_hits(ids text[], curated_ids text[])
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.scent_molecule_hits (molecule_id, curated, hit_count, last_hit_at)
  select id, id = any(curated_ids), 1, now()
  from unnest(ids) as id
  on conflict (molecule_id) do update
    set hit_count   = public.scent_molecule_hits.hit_count + 1,
        curated     = excluded.curated,
        last_hit_at = now();
$$;

revoke execute on function public.scent_bump_hits(text[], text[]) from anon, authenticated;
