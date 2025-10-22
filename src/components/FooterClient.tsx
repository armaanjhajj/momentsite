"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin, Music, Twitter } from "lucide-react";

export default function FooterClient() {
  const pathname = usePathname();
  const isTeam = pathname?.startsWith("/team");

  return (
    <footer className="border-t border-white/10 mt-16">
      <div className={`container py-8 ${isTeam ? "md:ml-[320px]" : ""}`}>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
          <Link href="/legal/terms" className="hover:text-white no-underline">Terms</Link>
          <Link href="/legal/privacy" className="hover:text-white no-underline">Privacy</Link>
          <Link href="/legal/accessibility" className="hover:text-white no-underline">Accessibility</Link>
          <Link href="/blog" className="hover:text-white no-underline">Blog</Link>
          <a href="mailto:contact@havemoments.com" className="hover:text-white no-underline">Contact</a>
          <Link href="/safety" className="hover:text-white no-underline">Safety</Link>
          <Link href="/" className="hover:text-white no-underline">Home</Link>
          <Link href="/survey" className="hover:text-white no-underline">Survey</Link>
          <Link href="/apply" className="hover:text-white no-underline">Apply</Link>
        </nav>
        <div className="mt-6 text-center">
          <div className="text-sm text-white/80">Moments — @letsmakemoments</div>
          <div className="mt-3 flex items-center justify-center gap-6">
            <a href="https://instagram.com/letsmakemoments" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
              <Instagram size={24} />
            </a>
            <a href="https://www.linkedin.com/company/letsmakemoments" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/80 hover:text-white transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="https://www.tiktok.com/@letsmakemoments" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white/80 hover:text-white transition-colors">
              <Music size={24} />
            </a>
            <a href="https://x.com/letsmakemoments" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-white/80 hover:text-white transition-colors">
              <Twitter size={24} />
            </a>
          </div>
          <div className="mt-4 text-xs text-white/60">© 2025 Moments. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}


