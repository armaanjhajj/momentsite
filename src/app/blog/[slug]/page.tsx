import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  body_html: string | null;
  published_at: string | null;
};

type Params = { params: { slug: string } };

export default async function BlogPostPage({ params }: Params) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, body_html, published_at")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return (
      <main className="container py-16">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <Link href="/blog" className="underline mt-4 inline-block">Back to blog</Link>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <article className="prose prose-invert max-w-3xl">
        <h1>{data.title}</h1>
        <div className="text-sm text-white/60">{data.published_at ? new Date(data.published_at).toLocaleDateString() : ""}</div>
        <div className="mt-6" dangerouslySetInnerHTML={{ __html: data.body_html ?? "" }} />
      </article>
    </main>
  );
}


