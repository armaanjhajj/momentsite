import type { Metadata } from "next";

// LYFESTYL lives at /lyfestyl and, through src/middleware.ts, at the root of
// lyfestyl.1moments.com. The icon files in this folder give it its own favicon.
// .lyfestyl-theme gives these pages the app's colors and type; the rest of
// the site stays black and white (see "LYFESTYL theme" in globals.css).

export const metadata: Metadata = {
  title: {
    default: "LYFESTYL",
    template: "%s · LYFESTYL",
  },
  description:
    "Calorie tracking from a photo. Free for iPhone, runs on device, photos never saved.",
  appleWebApp: { title: "LYFESTYL" },
};

export default function LyfestylLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="lyfestyl-theme">{children}</div>;
}
