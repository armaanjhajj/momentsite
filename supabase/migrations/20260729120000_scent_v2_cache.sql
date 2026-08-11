-- ============================================================
-- Making the v2 path actually deterministic
--
-- The claim was that the embedding path is deterministic where the
-- Claude path is not: same query, same vector, same results. The
-- first half of that turned out to be false when measured. Two
-- calls to Cohere Embed with an identical string return vectors
-- that differ around the fourth decimal:
--
--   run 1  [0.0283, -0.0033, -0.0016, -0.0090, -0.0363]
--   run 2  [0.0283, -0.0034, -0.0015, -0.0090, -0.0366]
--
-- Floating point reduction order on the serving side, presumably.
-- It is small, but it is enough to swap two near tied anchors,
-- which changes the query profile, which reorders the shortlist.
-- The final reranked identities happened to match; that is luck,
-- not a guarantee.
--
-- So the vector is memoised on normalised query text, exactly like
-- scent_decompositions memoises the Claude call. First answer wins
-- permanently. Everything downstream of the vector is arithmetic on
-- static files, so once the vector is fixed the whole pipeline is
-- fixed, and the determinism claim becomes true rather than hoped
-- for.
--
-- The rerank ordering is stored with it for the same reason.
-- ============================================================

create table if not exists public.scent_v2_cache (
  -- lowercased, trimmed, internal whitespace collapsed
  query_norm  text primary key,
  query_raw   text not null,
  model       text not null,
  dim         smallint not null,
  -- The query embedding. 1024 floats, and the reason this table exists.
  vec         real[] not null,
  -- The reranked ordering, so the second API call is also pinned.
  rerank      jsonb,
  created_at  timestamptz not null default now(),

  constraint scent_v2_cache_norm_len check (char_length(query_norm) between 1 and 300),
  constraint scent_v2_cache_dim check (dim = array_length(vec, 1))
);

alter table public.scent_v2_cache enable row level security;

drop policy if exists "Anyone can read v2 cache" on public.scent_v2_cache;
create policy "Anyone can read v2 cache"
  on public.scent_v2_cache for select
  using (true);

-- Writes go only through /api/scent/v2, which holds the service-role key.
drop policy if exists "No anon writes to v2 cache" on public.scent_v2_cache;
create policy "No anon writes to v2 cache"
  on public.scent_v2_cache for insert
  with check (false);
