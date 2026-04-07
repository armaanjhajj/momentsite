"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { JoinModal } from "@/components/JoinModal";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { label: "about", href: "/about" },
  { label: "projects", href: "/projects" },
  { label: "events", href: "/events" },
];

export function Nav() {
  const pathname = usePathname();
  const { session, profile } = useAuth();
  const [joinOpen, setJoinOpen] = useState(false);

  const initial = profile?.name?.charAt(0).toUpperCase() || "";

  return (
    <>
      <Link href="/" className="header-logo" aria-label="Home">
        <Logo color="white" size={28} />
      </Link>
      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-right">
        {session ? (
          <Link
            href="/profile"
            className="user-avatar"
            aria-label="Your profile"
          >
            {profile?.photo_url ? (
              <img src={profile.photo_url} alt={profile.name} />
            ) : (
              <span>{initial}</span>
            )}
          </Link>
        ) : (
          <button className="header-signup" onClick={() => setJoinOpen(true)}>
            JOIN
          </button>
        )}
        <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
      </div>
    </>
  );
}
