import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Moments × Panhellenic — Invite-only Mixer",
  description: "Private beta coffee mixer for Rutgers Greek leaders",
};

export default function MixerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Minimal header */}
      <div className="fixed inset-x-0 top-0 z-[100] backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-neutral-800">
        <header className="container flex items-center justify-between py-4 relative">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Moments" width={36} height={36} className="h-9 w-9 invert" />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-800/50 border border-neutral-800 text-sm text-white/60">
            Invite-only access
          </span>
        </header>
      </div>
      <div className="h-16" />
      {children}
    </>
  );
}

