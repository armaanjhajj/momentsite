"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { WaitlistModal } from "@/components/WaitlistModal";

const NAV_ITEMS = [{ label: "events", href: "/events" }];
const STORAGE_KEY = "moments-waitlist-joined";

export function Nav() {
  const pathname = usePathname();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    setJoined(!!localStorage.getItem(STORAGE_KEY));
  }, [waitlistOpen]);

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
        <button
          className={`header-signup ${joined ? "joined" : ""}`}
          onClick={() => setWaitlistOpen(true)}
        >
          {joined ? "ON THE LIST" : "JOIN"}
        </button>
        <WaitlistModal
          open={waitlistOpen}
          onClose={() => setWaitlistOpen(false)}
        />
      </div>
    </>
  );
}
