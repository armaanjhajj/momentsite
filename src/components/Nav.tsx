"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { WaitlistModal } from "@/components/WaitlistModal";

const NAV_ITEMS = [
  { label: "about", href: "/#about" },
  { label: "artifacts", href: "/exhibits" },
  { label: "contact", href: "/contact" },
];
const STORAGE_KEY = "moments-waitlist-joined";

export function Nav() {
  const pathname = usePathname();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [joined, setJoined] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setJoined(!!localStorage.getItem(STORAGE_KEY));
  }, [waitlistOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Glass header on scroll
  useEffect(() => {
    const header = document.querySelector(".header");
    if (!header) return;
    const onScroll = () =>
      header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Link href="/" className="header-logo" aria-label="Home">
        <Logo color="white" size={28} strokeWidth={20} />
      </Link>

      {/* Desktop nav */}
      <nav className="nav nav-desktop">
        {NAV_ITEMS.map((item) =>
          item.href.startsWith("http") ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          )
        )}
      </nav>

      <div className="header-right">
        {/* Desktop only: JOIN button */}
        <button
          className={`header-signup header-signup-desktop ${joined ? "joined" : ""}`}
          onClick={() => setWaitlistOpen(true)}
        >
          {joined ? "JOIN THE TEAM" : "JOIN"}
        </button>

        {/* Mobile only: hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        </button>

        <WaitlistModal
          open={waitlistOpen}
          onClose={() => setWaitlistOpen(false)}
        />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav
            className="mobile-menu"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_ITEMS.map((item) =>
              item.href.startsWith("http") ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-menu-item ${pathname === item.href ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mobile-menu-divider" />
            <button
              className={`mobile-menu-join ${joined ? "joined" : ""}`}
              onClick={() => {
                setMenuOpen(false);
                setWaitlistOpen(true);
              }}
            >
              {joined ? "JOIN THE TEAM" : "JOIN"}
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
