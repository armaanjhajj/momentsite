"use client";

export default function HeaderClient() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
      <header className="container flex items-center justify-between py-4">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Moments" className="h-9 w-9 invert" />
          <span className="sr-only">Moments</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="/" className="hover:text-white link-underline">Moments</a>
          <a href="/about" className="hover:text-white link-underline">About</a>
          <a href="/blog" className="hover:text-white link-underline">Blog</a>
          <a href="/creators" className="hover:text-white link-underline">Creators</a>
          <a href="/team" className="hover:text-white link-underline">Team</a>
          <a href="mailto:contact@havemoments.com" className="hover:text-white link-underline">Contact</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a href="/download" className="focus-accent rounded-full px-4 py-2 text-sm bg-white text-black hover:bg-transparent hover:text-white border border-transparent hover:border-accent transition">Download</a>
        </div>
      </header>
    </div>
  );
}


