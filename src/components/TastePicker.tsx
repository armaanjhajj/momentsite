"use client";

import { useState, useEffect, useRef } from "react";

export type TasteItem = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  item_type: "song" | "album" | "movie" | "tv" | "book";
};

type SearchType = "song" | "album" | "movie" | "tv" | "book";

type CategoryConfig = {
  label: string;
  types: { value: SearchType; label: string }[];
};

const CATEGORIES: Record<"music" | "film" | "literature", CategoryConfig> = {
  music: {
    label: "Music",
    types: [
      { value: "song", label: "Songs" },
      { value: "album", label: "Albums" },
    ],
  },
  film: {
    label: "Film & TV",
    types: [
      { value: "movie", label: "Movies" },
      { value: "tv", label: "TV Shows" },
    ],
  },
  literature: {
    label: "Literature",
    types: [{ value: "book", label: "Books" }],
  },
};

export function TastePicker({
  category,
  items,
  onChange,
  maxItems = 6,
}: {
  category: "music" | "film" | "literature";
  items: TasteItem[];
  onChange: (items: TasteItem[]) => void;
  maxItems?: number;
}) {
  const config = CATEGORIES[category];
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(config.types[0].value);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TasteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!searchOpen) return;
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?type=${searchType}&q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.results || []);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchType, searchOpen]);

  function addItem(item: TasteItem) {
    if (items.some((i) => i.id === item.id)) return;
    if (items.length >= maxItems) return;
    onChange([...items, item]);
    setQuery("");
    setResults([]);
    setSearchOpen(false);
  }

  function removeItem(id: string) {
    onChange(items.filter((i) => i.id !== id));
  }

  function getShapeClass(item_type: string) {
    if (item_type === "song") return "taste-shape-circle";
    if (item_type === "album") return "taste-shape-square";
    return "taste-shape-rect";
  }

  return (
    <div className="taste-picker">
      <div className="taste-items">
        {items.map((item) => (
          <div key={item.id} className={`taste-item ${getShapeClass(item.item_type)}`}>
            <img src={item.cover} alt={item.title} referrerPolicy="no-referrer" />
            <button
              type="button"
              className="taste-item-remove"
              onClick={() => removeItem(item.id)}
              aria-label="Remove"
            >
              &times;
            </button>
            <div className="taste-item-label">
              <span className="taste-item-title">{item.title}</span>
              <span className="taste-item-subtitle">{item.subtitle}</span>
            </div>
          </div>
        ))}
        {items.length < maxItems && (
          <button
            type="button"
            className="taste-add-btn"
            onClick={() => setSearchOpen(true)}
          >
            +
          </button>
        )}
      </div>

      {searchOpen && (
        <div className="taste-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="taste-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="taste-search-header">
              <h3>Add {config.label}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSearchOpen(false)}
              >
                &times;
              </button>
            </div>

            {config.types.length > 1 && (
              <div className="taste-type-tabs">
                {config.types.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`taste-type-tab ${searchType === t.value ? "active" : ""}`}
                    onClick={() => {
                      setSearchType(t.value);
                      setResults([]);
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              className="taste-search-input"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />

            <div className="taste-search-results">
              {loading && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="taste-result-skeleton">
                      <div className={`skeleton-img ${
                        searchType === "song"
                          ? "taste-shape-circle"
                          : searchType === "album"
                          ? "taste-shape-square"
                          : "taste-shape-rect"
                      }`} />
                      <div className="skeleton-text">
                        <div className="skeleton-line" />
                        <div className="skeleton-line short" />
                      </div>
                    </div>
                  ))}
                </>
              )}
              {!loading && results.length === 0 && query && (
                <p className="taste-loading">No results</p>
              )}
              {!loading && !query && (
                <p className="taste-loading">Start typing to search</p>
              )}
              {!loading &&
                results.map((r) => {
                  const already = items.some((i) => i.id === r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className="taste-result"
                      onClick={() => addItem(r)}
                      disabled={already || items.length >= maxItems}
                    >
                      <img src={r.cover} alt={r.title} className={getShapeClass(r.item_type)} referrerPolicy="no-referrer" />
                      <div className="taste-result-info">
                        <span className="taste-result-title">{r.title}</span>
                        <span className="taste-result-subtitle">{r.subtitle}</span>
                      </div>
                      {already && <span className="taste-result-added">✓</span>}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
