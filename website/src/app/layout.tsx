import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/components/HeaderClient";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moments — Real connections, built for campus",
  description: "Apple‑level marketing site for Moments. Crisp, monochrome with a single neon accent.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Moments",
    description: "Real connections, built for campus.",
    url: "/",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Moments", description: "Real connections, built for campus." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <HeaderClient />
        {children}
        <footer className="border-t border-white/10 mt-16">
          <div className="container py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm text-white/70">
            <div>
              <div className="font-medium text-white mb-3">Explore</div>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white no-underline">Moments</Link></li>
                <li><Link href="/team" className="hover:text-white no-underline">Team</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-white mb-3">For campus</div>
              <ul className="space-y-2">
                <li><Link href="/campus/rutgers-nb" className="hover:text-white no-underline">Rutgers NB</Link></li>
                <li><Link href="/campus/rutgers-newark" className="hover:text-white no-underline">Rutgers Newark</Link></li>
                <li><Link href="/partners" className="hover:text-white no-underline">Partner with us</Link></li>
                <li><Link href="/safety" className="hover:text-white no-underline">Safety</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-white mb-3">Company</div>
              <ul className="space-y-2">
                <li><Link href="/blog" className="hover:text-white no-underline">Blog</Link></li>
                <li><a href="mailto:contact@havemoments.com" className="hover:text-white no-underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-white mb-3">Legal</div>
              <ul className="space-y-2">
                <li><Link href="/legal/privacy" className="hover:text-white no-underline">Privacy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white no-underline">Terms</Link></li>
                <li><Link href="/legal/community-guidelines" className="hover:text-white no-underline">Community Guidelines</Link></li>
                <li><Link href="/legal/accessibility" className="hover:text-white no-underline">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="container pb-6 flex items-center justify-between gap-4">
            <div className="text-sm text-white/80">Moments — @letsmakemoments</div>
            <div className="flex items-center gap-4 text-white/70">
              <a href="https://x.com/letsmakemoments" aria-label="X" className="hover:text-white" target="_blank" rel="noopener noreferrer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h4.5l5 6.5 6-6.5H20l-6.5 7 7 9H16l-4.5-6L6 20H4l7-7L4 4z" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/letsmakemoments" aria-label="LinkedIn" className="hover:text-white" target="_blank" rel="noopener noreferrer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM4 9h2.9v12H4V9zm6.5 0H14v1.7h.04c.5-.9 1.74-1.86 3.58-1.86 3.83 0 4.54 2.42 4.54 5.57V21H19v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-1.99 1.35-1.99 2.75V21h-2.9V9z" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://instagram.com/letsmakemoments" aria-label="Instagram" className="hover:text-white" target="_blank" rel="noopener noreferrer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="container pb-4 text-xs text-white/60">© 2025 Moments. Built at Rutgers.</div>
        </footer>
      </body>
    </html>
  );
}
