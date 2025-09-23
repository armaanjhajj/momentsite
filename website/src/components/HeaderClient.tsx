"use client";
import Link from "next/link";

export default function HeaderClient() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
      <header className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Moments" className="h-9 w-9 invert" />
          <span className="sr-only">Moments</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <Link href="/" className="hover:text-white no-underline">Moments</Link>
          <Link href="/blog" className="hover:text-white no-underline">Blog</Link>
          <Link href="/team" className="hover:text-white no-underline">Team</Link>
          <a href="mailto:contact@havemoments.com" className="hover:text-white no-underline">Contact</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/waitlist" className="focus-accent rounded-full px-4 py-2 text-sm bg-white text-black border border-transparent hover:bg-white/80 hover:text-black transition">Join waitlist</Link>
        </div>
      </header>
    </div>
  );
}


