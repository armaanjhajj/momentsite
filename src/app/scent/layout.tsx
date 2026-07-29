// The page itself is a client component, so its metadata lives here.

export const metadata = {
  title: "SCENT · Moments",
  description:
    "Smell is the only sense with no coordinate system. SCENT builds one: describe a memory and get back the molecules nearest to it, with their structures, their descriptors, and where you meet them in the world.",
};

export default function ScentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
