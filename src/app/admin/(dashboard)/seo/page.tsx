import { prisma } from "@/lib/db";
import CopyLink from "@/components/admin/copy-link";

export default async function AdminSeoPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const publishedPosts = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });
  const publishedCourses = await prisma.course.count({ where: { published: true } });
  const staticPages = 6; // home, courses, pricing, about, blog, contact

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">SEO</h1>
      <p className="text-sm text-muted mb-8">
        Your sitemap updates automatically as you publish courses and blog posts — nothing to
        regenerate manually. Submit it once in each search engine&apos;s webmaster tool below.
      </p>

      <div className="space-y-6">
        <div>
          <div className="label text-xs text-primary mb-2">Sitemap</div>
          <CopyLink url={`${siteUrl}/sitemap.xml`} />
          <p className="mt-2 text-xs text-muted-2">
            Includes {staticPages} static pages, {publishedCourses} published course
            {publishedCourses === 1 ? "" : "s"}, and {publishedPosts} published blog post
            {publishedPosts === 1 ? "" : "s"}.
          </p>
        </div>

        <div>
          <div className="label text-xs text-primary mb-2">Robots.txt</div>
          <CopyLink url={`${siteUrl}/robots.txt`} />
          <p className="mt-2 text-xs text-muted-2">Blocks /admin and /api from search crawlers.</p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold mb-4">Submit to Google Search Console</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted">
          <li>
            Go to{" "}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              search.google.com/search-console
            </a>{" "}
            and sign in with the Google account that manages this site.
          </li>
          <li>Add this domain as a property and verify ownership (Google will walk you through it — usually a DNS record or an HTML file upload).</li>
          <li>
            Once verified, go to <strong>Sitemaps</strong> in the left sidebar, paste{" "}
            <code className="text-primary">sitemap.xml</code>, and click Submit.
          </li>
        </ol>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold mb-4">Submit to Bing Webmaster Tools</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted">
          <li>
            Go to{" "}
            <a
              href="https://www.bing.com/webmasters"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              bing.com/webmasters
            </a>{" "}
            and sign in (you can also import your verified Google Search Console site directly).
          </li>
          <li>Add and verify the domain.</li>
          <li>Under Sitemaps, submit the full sitemap URL above.</li>
        </ol>
      </div>
    </div>
  );
}
