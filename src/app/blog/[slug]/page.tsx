import Link from "next/link";

// Static blog posts are implemented as individual pages under /blog/<slug>/page.tsx.
// This dynamic route acts as a safety fallback for unknown slugs.

type Params = { params: { slug: string } };

export default async function BlogPostPage({ params }: Params) {
  return (
    <main className="container py-16">
      <h1 className="text-2xl font-semibold">Post not found</h1>
      <Link href="/blog" className="underline mt-4 inline-block">Back to blog</Link>
    </main>
  );
}


