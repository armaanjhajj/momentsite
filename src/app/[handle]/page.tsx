import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ProfileView } from "@/components/ProfileView";

const RESERVED_HANDLES = new Set([
  "about",
  "projects",
  "events",
  "profile",
  "onboarding",
  "impulse",
  "apply",
  "team",
  "app",
  "terms",
  "privacy",
  "api",
  "admin",
  "signup",
  "login",
  "logout",
]);

export default async function HandlePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  if (RESERVED_HANDLES.has(handle.toLowerCase())) {
    notFound();
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: user } = await supabase
    .from("users")
    .select("id, name, handle, photo_url, headline, school, location, website, birthday")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();

  if (!user) {
    notFound();
  }

  const [{ data: taste }, { data: impulse }] = await Promise.all([
    supabase
      .from("user_taste")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true }),
    supabase
      .from("impulse")
      .select("synopsis")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const hasImpulse = !!impulse?.synopsis;

  return <ProfileView user={user} taste={taste || []} hasImpulse={hasImpulse} />;
}
