import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

export default async function Blog() {
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image_url, published_at")
    .order("published_at", { ascending: false });

  if (error) {
    console.error(error.message);
  }

  const list = (posts ?? []) as BlogPost[];

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


