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
  {
    slug: "mvp-ready",
    title: "Finished our MVP (ready for our 10/25 launch)",
    excerpt:
      "From idea to MVP: building a product that helps people reconnect in real life.",
    date: "September 23, 2025",
    image: "https://i.imgur.com/5i7oyGS.png",
  },
  {
    slug: "collabs-bxo-ind-sigrho",
    title: "Building Moments Together: Our Collabs with BXO, IND, and SigRho",
    excerpt:
      "Parties with purpose: creating real connections across orgs and campuses.",
    date: "September 22, 2025",
    image: "https://i.imgur.com/bnL08pm.jpeg",
  },
  {
    slug: "branching-out-expanding-team",
    title: "Branching Out: Building Moments Together",
    excerpt:
      "We’re growing the team — creators, builders, organizers, and storytellers.",
    date: "September 21, 2025",
    image: "https://i.imgur.com/to1RzTY.png",
  },
];

export default function Blog() {
  return (
    <main className="container py-16">
      <header>
        <h1 className="text-4xl md:text-5xl font-semibold">Moments Blog</h1>
        <p className="mt-2 text-white/70">Stories from the build, campus launches, and the community.</p>
      </header>
      <hr className="mt-6 border-white/10" />
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group block rounded-2xl border border-white/10 overflow-hidden bg-white/5 hover:bg-white/10 transition">
            <div className="aspect-[16/9] relative">
              <Image src={p.image} alt={p.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <div className="text-xs text-white/60">{p.date} • Moments Team</div>
              <div className="mt-1 font-semibold group-hover:underline text-lg">{p.title}</div>
              <div className="text-white/70 text-sm mt-1 line-clamp-2">{p.excerpt}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}


