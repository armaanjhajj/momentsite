import Link from "next/link";
import Image from "next/image";

const posts = [
  {
    slug: "introducing-moments",
    title: "Introducing, Moments",
    excerpt: "Redefining social connection: launching this fall at Rutgers.",
    date: "August 31, 2025",
    image: "https://i.imgur.com/VmYjp6Q.png",
  },
];

export default function Blog() {
  return (
    <main className="container py-16">
      <h1 className="text-3xl md:text-5xl font-semibold">Blog</h1>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group block rounded-2xl border border-white/10 overflow-hidden bg-white/5 hover:bg-white/10 transition">
            <div className="aspect-[16/9] relative">
              <Image src={p.image} alt={p.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <div className="text-xs text-white/60">{p.date}</div>
              <div className="mt-1 font-semibold group-hover:underline">{p.title}</div>
              <div className="text-white/70 text-sm mt-1">{p.excerpt}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}


