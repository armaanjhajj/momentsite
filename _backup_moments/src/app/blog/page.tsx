import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: "Moments Blog",
  description: "Stories from the build, campus launches, and the community.",
};

export default async function Blog() {
  const posts = getAllPosts();

  return (
    <main className="container py-16">
      <header>
        <h1 className="text-4xl md:text-5xl font-semibold">Moments Blog</h1>
        <p className="mt-2 text-white/70">Stories from the build, campus launches, and the community.</p>
      </header>
      <hr className="mt-6 border-neutral-800" />
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`} 
            className="group block rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-800/50 hover:bg-neutral-800/80 transition"
          >
            {post.banner && (
              <div className="aspect-[16/9] relative">
                <Image 
                  src={post.banner} 
                  alt={post.title} 
                  fill 
                  className="object-cover" 
                />
              </div>
            )}
            <div className="p-4">
              <div className="text-xs text-white/60">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} • {post.author}
              </div>
              <div className="mt-1 font-semibold group-hover:underline text-lg">{post.title}</div>
              {post.description && (
                <div className="text-white/70 text-sm mt-1 line-clamp-2">{post.description}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
