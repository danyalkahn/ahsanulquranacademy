import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { HeroBadge, HeroGlow } from "@/components/hero-background";

// Rendered per-request rather than at build time — the database isn't
// reachable during `next build` on Hostinger, only at runtime.
export const dynamic = "force-dynamic";

const blogDescription = "Guidance, tips and updates on learning Quran, Tajweed, Hifz and Arabic from Ahsan Ul Quran Academy.";

export const metadata: Metadata = {
  title: "Blog",
  description: blogDescription,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog — Ahsan Ul Quran Academy", description: blogDescription, url: "/blog" },
  twitter: { card: "summary_large_image", title: "Blog — Ahsan Ul Quran Academy", description: blogDescription },
};

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div>
      <div className="relative overflow-hidden text-center px-6 pt-20 pb-6">
        <HeroGlow />
        <div className="relative max-w-2xl mx-auto">
          <HeroBadge label="BLOG" />
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
            Guidance &amp; updates
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        {posts.length === 0 ? (
          <p className="text-center text-sm text-muted">No posts yet — check back soon.</p>
        ) : (
          <div className="reveal space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block rounded-2xl border border-black/10 bg-white p-6 sm:p-8 transition hover:border-primary/30 hover:-translate-y-1"
              >
                <div className="text-xs text-muted-2 font-mono">
                  {post.publishedAt?.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <h2 className="mt-2 text-xl sm:text-2xl font-bold">{post.title}</h2>
                <p className="mt-2 text-sm text-muted leading-relaxed">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
