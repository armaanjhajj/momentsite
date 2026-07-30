// The MSI board: everything that reads posts.
//
// Plain fetch against PostgREST rather than supabase-js. Two of these
// functions run in the browser, and pulling the SDK in for four GETs and one
// RPC added 60 kB to the /scent bundle for no capability the fetches do not
// already have. There is no auth here to manage: reads are public.
//
// Writes are not here. Posting goes through /api/scent/post, which recomputes
// a post's coordinates server-side; see the migration for why.

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const REST = `${URL_BASE}/rest/v1`;

const headers = (extra?: Record<string, string>) => ({
  apikey: ANON,
  Authorization: `Bearer ${ANON}`,
  ...extra,
});

export type PostMolecule = { id: string; name: string; score: number };

export type ScentPost = {
  id: string;
  memory: string;
  query: string;
  sense: number;
  zone: number;
  code: number;
  region: string;
  sub: string;
  profile: Record<string, number>;
  molecules: PostMolecule[];
  created_at: string;
  /** cosine similarity to the query vector. Only the nearest feed sets it. */
  similarity?: number;
};

/** Columns every feed needs. `vec` is deliberately absent: it is 48 floats per
 *  row and nothing in the UI reads it. */
const FIELDS =
  "id,memory,query,sense,zone,code,region,sub,profile,molecules,created_at";

/**
 * One read. Never throws: a board that cannot be reached should render as an
 * empty board, not as an error page over the rest of the exhibit.
 */
async function get<T>(path: string): Promise<T[]> {
  if (!URL_BASE || !ANON) return [];
  try {
    const res = await fetch(`${REST}/${path}`, {
      headers: headers(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

/** A count without the rows, read off the Content-Range header. */
async function count(path: string): Promise<number> {
  if (!URL_BASE || !ANON) return 0;
  try {
    const res = await fetch(`${REST}/${path}`, {
      method: "HEAD",
      headers: headers({ Prefer: "count=exact", Range: "0-0" }),
      cache: "no-store",
    });
    // Comes back as "0-0/128", or "*/0" when there is nothing to count.
    const total = res.headers.get("content-range")?.split("/")[1];
    const n = Number(total);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

/** Newest first. The plain feed, for browsing. */
export function recentPosts(limit = 24): Promise<ScentPost[]> {
  return get<ScentPost>(
    `scent_posts?select=${FIELDS}&order=created_at.desc&limit=${limit}`
  );
}

export function totalPosts(): Promise<number> {
  return count("scent_posts?select=id");
}
