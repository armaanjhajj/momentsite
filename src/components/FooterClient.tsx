"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
          <Link href="/" className="hover:text-white no-underline">Moments</Link>
          <Link href="/survey" className="hover:text-white no-underline">Survey</Link>
          <Link href="/apply" className="hover:text-white no-underline">Apply</Link>
        </nav>
        <div className="mt-6 text-center">
          <div className="text-sm text-white/80">Moments — @letsmakemoments</div>
          <div className="mt-3 flex items-center justify-center gap-6">
            <a href="https://instagram.com/letsmakemoments" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png" alt="Instagram" className="h-6 w-6 object-contain  opacity-80 hover:opacity-100 transition" />
            </a>
            <a href="https://www.linkedin.com/company/letsmakemoments" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="https://yt3.googleusercontent.com/i6KNxiy3gME-BulL4WnuGkTGqHuSYF8jl1WRn0rXftcJdSYK7dHKcJ3gLAaPc-KfhmLSYPwf824=s900-c-k-c0x00ffffff-no-rj" alt="LinkedIn" className="h-6 w-6 object-contain  opacity-80 hover:opacity-100 transition" />
            </a>
            <a href="https://www.tiktok.com/@letsmakemoments" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <img src="https://store-images.s-microsoft.com/image/apps.47495.13634052595610511.c45457c9-b4af-46b0-8e61-8d7c0aec3f56.a8b71481-8a43-465d-88d6-e63add92c112" alt="TikTok" className="h-6 w-6 object-contain  opacity-80 hover:opacity-100 transition" />
            </a>
            <a href="https://x.com/letsmakemoments" target="_blank" rel="noopener noreferrer" aria-label="X">
              <img src="https://play-lh.googleusercontent.com/A-Rnrh0J7iKmABskTonqFAANRLGTGUg_nuE4PEMYwJavL3nPt5uWsU2WO_DSgV_mOOM" alt="X" className="h-6 w-6 object-contain  opacity-80 hover:opacity-100 transition" />
            </a>
          </div>
          <div className="mt-4 text-xs text-white/60">© 2025 Moments. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}


