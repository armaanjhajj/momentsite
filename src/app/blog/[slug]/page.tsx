import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getAllSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';
import './markdown.css';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-sm text-white/70 hover:text-white transition">
          ← Back to blog
        </Link>
        
        <h1 className="mt-6 text-4xl md:text-5xl font-semibold leading-tight">
          {post.title}
        </h1>
        
        <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
          <span className="font-medium">{post.author}</span>
          <span>•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>

        {post.banner && (
          <div className="mt-8">
            <div className="relative w-full aspect-[2/1] overflow-hidden rounded-xl border border-neutral-800">
              <Image
                src={post.banner}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <hr className="mt-8 border-neutral-800" />

        <article 
          className="markdown-content mt-8"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </div>
    </main>
  );
}
