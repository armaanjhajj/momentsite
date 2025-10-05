import Link from "next/link";
import Image from "next/image";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  cover_image_url?: string;
  published_at?: string;
};

export default async function Blog() {
  // Static posts sourced from files under /blog/<slug>/page.tsx
  const list: BlogPost[] = [
    {
      id: "introducing-moments",
      slug: "introducing-moments",
      title: "Introducing, Moments — launching this fall at Rutgers",
      excerpt: "Redefining social connection on campus.",
      cover_image_url: "https://i.imgur.com/VmYjp6Q.png",
      published_at: "2025-08-31",
    },
    {
      id: "branching-out-expanding-team",
      slug: "branching-out-expanding-team",
      title: "Branching Out: Building Moments Together",
      excerpt: "We’re growing the team — creators, builders, organizers, storytellers.",
      cover_image_url: "https://i.imgur.com/to1RzTY.png",
      published_at: "2025-09-21",
    },
    {
      id: "collabs-bxo-ind-sigrho",
      slug: "collabs-bxo-ind-sigrho",
      title: "Building Moments Together: Our Collabs with BXO, IND, and SigRho",
      excerpt: "Parties with purpose: creating real connections across orgs and campuses.",
      cover_image_url: "https://i.imgur.com/bnL08pm.jpeg",
      published_at: "2025-09-22",
    },
    {
      id: "mvp-ready",
      slug: "mvp-ready",
      title: "Finished our MVP (ready for our 10/25 launch)",
      excerpt: "From idea to MVP: building a product that helps people reconnect.",
      cover_image_url: "https://i.imgur.com/5i7oyGS.png",
      published_at: "2025-09-23",
    },
  ];

  return (
    <main className="container py-16">
      <header>
        <h1 className="text-4xl md:text-5xl font-semibold">Moments Blog</h1>
        <p className="mt-2 text-white/70">Stories from the build, campus launches, and the community.</p>
      </header>
      <hr className="mt-6 border-white/10" />
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="group block rounded-2xl border border-white/10 overflow-hidden bg-white/5 hover:bg-white/10 transition">
            <div className="aspect-[16/9] relative">
              {p.cover_image_url && <Image src={p.cover_image_url} alt={p.title} fill className="object-cover" />}
            </div>
            <div className="p-4">
              <div className="text-xs text-white/60">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ""} • Moments Team</div>
              <div className="mt-1 font-semibold group-hover:underline text-lg">{p.title}</div>
              {p.excerpt && <div className="text-white/70 text-sm mt-1 line-clamp-2">{p.excerpt}</div>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}


