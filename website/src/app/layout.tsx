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
                <li><Link href="/" className="hover:text-white">Moments</Link></li>
                <li><Link href="/wearables" className="hover:text-white">Wearables</Link></li>
                <li><Link href="/creators" className="hover:text-white">Creators</Link></li>
                <li><Link href="/campus" className="hover:text-white">Campus</Link></li>
                <li><Link href="/team" className="hover:text-white">Team</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-white mb-3">For campus</div>
              <ul className="space-y-2">
                <li><Link href="/campus/rutgers-nb" className="hover:text-white">Rutgers NB</Link></li>
                <li><Link href="/campus/rutgers-newark" className="hover:text-white">Rutgers Newark</Link></li>
                <li><Link href="/partners" className="hover:text-white">Partner with us</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-white mb-3">Company</div>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
                <li><a href="mailto:contact@havemoments.com" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-white mb-3">Legal</div>
              <ul className="space-y-2">
                <li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/legal/community-guidelines" className="hover:text-white">Community Guidelines</Link></li>
                <li><Link href="/legal/accessibility" className="hover:text-white">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="container pb-10 text-xs text-white/60">© 2025 Moments. Built at Rutgers.</div>
        </footer>
      </body>
    </html>
  );
}
