import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/components/HeaderClient";
import FooterClient from "@/components/FooterClient";
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
        <div className="h-16" />
        {children}
        <FooterClient />
      </body>
    </html>
  );
}
