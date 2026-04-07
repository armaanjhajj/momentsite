"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function ProfileRedirect() {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (profile?.handle) {
      router.replace(`/${profile.handle}`);
    } else {
      router.replace("/");
    }
  }, [profile, loading, router]);

  return null;
}
