"use client";

import { supabase } from "./supabaseClient";

function guessExt(file: File): string {
  const nameExt = file.name.split(".").pop()?.toLowerCase();
  if (nameExt) return nameExt;
  const type = file.type || "";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("jpeg")) return "jpg";
  if (type.includes("jpg")) return "jpg";
  return "jpg";
}

export async function uploadImageToBucket(options: {
  file: File;
  primaryBucket: string;
  fallbackBucket?: string;
  pathPrefix?: string;
}): Promise<string> {
  const { file, primaryBucket, fallbackBucket, pathPrefix } = options;
  const ext = guessExt(file);
  const path = `${pathPrefix ?? "uploads"}/${crypto.randomUUID()}.${ext}`;

  // Try primary bucket first
  let { error } = await supabase.storage
    .from(primaryBucket)
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type || undefined });

  if (error && fallbackBucket && /not\s*found/i.test(error.message)) {
    const res = await supabase.storage
      .from(fallbackBucket)
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type || undefined });
    error = res.error || null as any;
    if (!error) {
      const { data } = supabase.storage.from(fallbackBucket).getPublicUrl(path);
      return data.publicUrl;
    }
  }

  if (error) throw error;
  const { data } = supabase.storage.from(primaryBucket).getPublicUrl(path);
  return data.publicUrl;
}




