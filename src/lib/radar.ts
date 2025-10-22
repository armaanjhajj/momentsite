"use client";

export type RadarAddressSuggestion = {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  confidence: "exact" | "interpolated" | "fallback";
  addressNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
  county?: string;
  neighborhood?: string;
  label?: string;
};

const RADAR_BASE = "https://api.radar.io/v1";

function getApiKey() {
  return (
    (process.env.NEXT_PUBLIC_RADAR_API_KEY as string | undefined) ||
    (process.env.EXPO_PUBLIC_RADAR_API_KEY as string | undefined) ||
    ""
  );
}

export async function getAddressSuggestions(query: string): Promise<RadarAddressSuggestion[]> {
  const apiKey = getApiKey();
  if (!apiKey || query.trim().length < 3) return [];
  try {
    const resp = await fetch(
      `${RADAR_BASE}/search/autocomplete?query=${encodeURIComponent(query)}&limit=8&layers=address`,
      { headers: { Authorization: apiKey, "Content-Type": "application/json" } }
    );
    if (!resp.ok) return [];
    const data = await resp.json();
    if (!Array.isArray(data?.addresses)) return [];
    const addresses = data.addresses.filter((a: { layer?: string }) => !a.layer || a.layer === "address");
    return addresses.map((a: {
      formattedAddress: string;
      latitude: number;
      longitude: number;
      confidence?: string;
      number?: string;
      addressNumber?: string;
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      countryCode?: string;
      county?: string;
      neighborhood?: string;
      label?: string;
      placeLabel?: string;
    }) => ({
      formattedAddress: a.formattedAddress,
      latitude: a.latitude,
      longitude: a.longitude,
      confidence: (a.confidence as "exact" | "interpolated" | "fallback") || "exact",
      addressNumber: a.number || a.addressNumber,
      street: a.street,
      city: a.city,
      state: a.state,
      postalCode: a.postalCode,
      country: a.country,
      countryCode: a.countryCode,
      county: a.county,
      neighborhood: a.neighborhood,
      label: a.label || a.placeLabel,
    }));
  } catch {
    return [];
  }
}




