import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

// Rendered per-request rather than at build time — the database isn't
// reachable during `next build` on Hostinger, only at runtime.
export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "PUBLISHED") return null;
  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const image = post.ogImage || post.coverImage || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      images: image ? [image] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.ogImage || post.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Ahsan Ul Quran Academy" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${post.slug}` },
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-xs text-muted-2 font-mono">
        {post.publishedAt?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{post.title}</h1>
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="mt-8 w-full rounded-2xl border border-black/10 object-cover"
        />
      )}
      <div
        className="prose prose-sm sm:prose-base max-w-none mt-10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
