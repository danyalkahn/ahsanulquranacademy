import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

// Rendered per-request rather than at build time — the database isn't
// reachable during `next build` on Hostinger, only at runtime.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = ["", "/courses", "/pricing", "/about", "/blog", "/contact", "/trial"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })
  );

  const [courses, posts] = await Promise.all([
    prisma.course.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const courseRoutes = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: course.updatedAt,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...staticRoutes, ...courseRoutes, ...postRoutes];
}
