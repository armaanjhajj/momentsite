"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeaderClient() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
      <header className="container flex items-center justify-between py-4 relative">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Moments" className="h-9 w-9 invert" />
          <span className="sr-only">Moments</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <Link href="/" className="hover:text-white no-underline">Moments</Link>
          <Link href="/blog" className="hover:text-white no-underline">Blog</Link>
          <Link href="/team" className="hover:text-white no-underline">Team</Link>
          <Link href="/apply" className="hover:text-white no-underline">Apply</Link>
          <a href="mailto:contact@havemoments.com" className="hover:text-white no-underline">Contact</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/waitlist" className="focus-accent rounded-full px-4 py-2 text-sm bg-white text-black border border-transparent hover:bg-white/80 hover:text-black transition">Join waitlist</Link>
        </div>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M3.75 6.75h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5zM3.75 12.75h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5zM3.75 18.75h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5z" />
            </svg>
          )}
        </button>
        <div
          id="mobile-nav"
          className={`md:hidden fixed inset-x-0 top-16 z-40 transform transition-all duration-200 ${isOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2"}`}
        >
          <div className="border-t border-white/10 bg-black/95 backdrop-blur">
            <nav className="container py-3 flex flex-col gap-3 text-sm text-white/90">
              <Link href="/" className="hover:text-white no-underline" onClick={closeMenu}>Moments</Link>
              <Link href="/blog" className="hover:text-white no-underline" onClick={closeMenu}>Blog</Link>
              <Link href="/team" className="hover:text-white no-underline" onClick={closeMenu}>Team</Link>
              <Link href="/apply" className="hover:text-white no-underline" onClick={closeMenu}>Apply</Link>
              <a href="mailto:contact@havemoments.com" className="hover:text-white no-underline" onClick={closeMenu}>Contact</a>
              <div className="pt-1 pb-1">
                <Link href="/waitlist" className="block focus-accent rounded-full px-4 py-2 text-center text-sm bg-white text-black border border-transparent hover:bg-white/80 hover:text-black transition" onClick={closeMenu}>Join waitlist</Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}


