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
          <div className="container py-8">
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
              <Link href="/legal/terms" className="hover:text-white no-underline">Terms</Link>
              <Link href="/legal/privacy" className="hover:text-white no-underline">Privacy</Link>
              <Link href="/legal/accessibility" className="hover:text-white no-underline">Accessibility</Link>
              <Link href="/blog" className="hover:text-white no-underline">Blog</Link>
              <a href="mailto:contact@havemoments.com" className="hover:text-white no-underline">Contact</a>
              <Link href="/safety" className="hover:text-white no-underline">Safety</Link>
              <Link href="/" className="hover:text-white no-underline">Moments</Link>
              <Link href="/team" className="hover:text-white no-underline">Team</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
