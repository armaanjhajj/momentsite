import { NextRequest, NextResponse } from "next/server";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  item_type: "song" | "album" | "movie" | "tv" | "book";
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const q = searchParams.get("q");

  if (!q || !type) {
    return NextResponse.json({ results: [] });
  }

  try {
    let results: SearchResult[] = [];

    if (type === "song") {
      const res = await fetch(
        `https://api.deezer.com/search/track?q=${encodeURIComponent(q)}&limit=12`
      );
      const data = await res.json();
      results = (data.data || []).map((t: {
        id: number;
        title: string;
        artist: { name: string };
        album: { cover_medium: string };
      }) => ({
        id: String(t.id),
        title: t.title,
        subtitle: t.artist.name,
        cover: t.album.cover_medium,
        item_type: "song" as const,
      }));
    } else if (type === "album") {
      const res = await fetch(
        `https://api.deezer.com/search/album?q=${encodeURIComponent(q)}&limit=12`
      );
      const data = await res.json();
      results = (data.data || []).map((a: {
        id: number;
        title: string;
        artist: { name: string };
        cover_medium: string;
      }) => ({
        id: String(a.id),
        title: a.title,
        subtitle: a.artist.name,
        cover: a.cover_medium,
        item_type: "album" as const,
      }));
    } else if (type === "movie" || type === "tv") {
      const omdbType = type === "movie" ? "movie" : "series";
      const apiKey = process.env.OMDB_API_KEY || "thewdb";
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(q)}&type=${omdbType}&apikey=${apiKey}`
      );
      const data = await res.json();
      results = (data.Search || [])
        .filter((m: { Poster?: string }) => m.Poster && m.Poster !== "N/A")
        .slice(0, 12)
        .map((m: {
          imdbID: string;
          Title: string;
          Year: string;
          Poster: string;
        }) => ({
          id: m.imdbID,
          title: m.Title,
          subtitle: m.Year,
          cover: m.Poster,
          item_type: type === "movie" ? ("movie" as const) : ("tv" as const),
        }));
    } else if (type === "book") {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=12`
      );
      const data = await res.json();
      results = (data.docs || [])
        .filter((b: { cover_i?: number }) => b.cover_i)
        .slice(0, 12)
        .map((b: {
          key: string;
          title: string;
          author_name?: string[];
          cover_i: number;
        }) => ({
          id: b.key,
          title: b.title,
          subtitle: b.author_name?.[0] || "Unknown",
          cover: `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`,
          item_type: "book" as const,
        }));
    }

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { results: [], error: String(err) },
      { status: 500 }
    );
  }
}
