"use client";

import { useEffect, useState } from "react";
import { getAddressSuggestions, type RadarAddressSuggestion } from "@/lib/radar";

export default function AddressAutocomplete({
  value,
  onSelect,
  placeholder,
}: {
  value: string;
  onSelect: (s: RadarAddressSuggestion) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value ?? "");
  const [suggestions, setSuggestions] = useState<RadarAddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      const res = await getAddressSuggestions(query);
      setSuggestions(res);
      setOpen(true);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="relative">
      <input
        className="w-full rounded-lg bg-neutral-800/50 border border-neutral-800 px-3 py-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length && setOpen(true)}
        placeholder={placeholder || "Enter an address or place..."}
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-800 bg-black/90 backdrop-blur max-h-60 overflow-auto">
          {suggestions.map((s, i) => (
            <button
              key={`${s.formattedAddress}-${i}`}
              type="button"
              onClick={() => {
                onSelect(s);
                setQuery(s.formattedAddress);
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-white/10"
            >
              {s.formattedAddress}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}




