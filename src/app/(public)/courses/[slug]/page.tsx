import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import FaqAccordion, { type Faq } from "@/components/faq-accordion";

// Rendered per-request rather than at build time — the database isn't
// reachable during `next build` on Hostinger, only at runtime.
export const dynamic = "force-dynamic";

async function getCourse(slug: string) {
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course || !course.published) return null;
  return course;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};

  const title = course.seoTitle || course.title;
  const description = course.seoDescription || course.shortDescription;
  const image = course.ogImage || course.heroImage || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/courses/${course.slug}`,
      images: image ? [image] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const faqs = Array.isArray(course.faqs) ? (course.faqs as Faq[]) : [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription,
    provider: {
      "@type": "EducationalOrganization",
      name: "Ahsan Ul Quran Academy",
      sameAs: siteUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Courses", item: `${siteUrl}/courses` },
      { "@type": "ListItem", position: 2, name: course.title, item: `${siteUrl}/courses/${course.slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Link href="/courses" className="text-sm text-primary hover:underline">
        ← All courses
      </Link>

      {course.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={course.heroImage}
          alt={course.title}
          className="mt-6 w-full rounded-2xl border border-black/10 object-cover"
        />
      ) : (
        <div className="mt-6 flex h-40 items-center justify-center rounded-2xl border border-black/10 bg-gradient-to-br from-primary/10 to-gold/10 text-5xl">
          {course.icon || "📖"}
        </div>
      )}

      <h1 className="mt-8 text-3xl sm:text-4xl font-bold tracking-tight">{course.title}</h1>
      <p className="mt-3 text-lg text-muted leading-relaxed">{course.shortDescription}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/trial?course=${course.slug}`}
          className="rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(15,110,79,0.35)] transition hover:bg-primary-light"
        >
          Start Free Trial
        </Link>
        <Link
          href="/pricing"
          className="rounded-xl border border-black/10 px-7 py-3.5 text-sm text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          View pricing
        </Link>
      </div>

      <div
        className="prose prose-sm sm:prose-base max-w-none mt-10"
        dangerouslySetInnerHTML={{ __html: course.contentHtml }}
      />

      {faqs.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently asked questions</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      )}

      <div className="mt-16 rounded-[24px] border border-black/10 bg-gradient-to-b from-primary/[0.06] to-transparent p-8 text-center">
        <h2 className="text-2xl font-bold">Ready to get started?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted leading-relaxed">
          Book a free trial class for {course.title.toLowerCase()} — no obligation.
        </p>
        <Link
          href={`/trial?course=${course.slug}`}
          className="mt-6 inline-block rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(15,110,79,0.35)] transition hover:bg-primary-light"
        >
          Start Free Trial
        </Link>
      </div>
    </article>
  );
}
