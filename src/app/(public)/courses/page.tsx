import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { HeroBadge, HeroGlow } from "@/components/hero-background";
import CourseCard from "@/components/course-card";

// Rendered per-request rather than at build time — the database isn't
// reachable during `next build` on Hostinger, only at runtime.
export const dynamic = "force-dynamic";

const description =
  "Online Quran classes for kids and adults, Tajweed, Hifz, Noorani Qaida, Arabic and Islamic Studies — one-on-one with certified teachers.";

export const metadata: Metadata = {
  title: "Courses",
  description,
  alternates: { canonical: "/courses" },
  openGraph: { title: "Courses — Ahsan Ul Quran Academy", description, url: "/courses" },
  twitter: { card: "summary_large_image", title: "Courses — Ahsan Ul Quran Academy", description },
};

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="relative overflow-hidden text-center px-6 pt-20 pb-6">
        <HeroGlow />
        <div className="relative max-w-2xl mx-auto">
          <HeroBadge label="OUR COURSES" />
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            A course for every
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-lighter to-primary bg-clip-text text-transparent">
              stage of learning
            </span>
          </h1>
          <p className="mt-5 text-base text-muted leading-relaxed">
            One-on-one live classes with certified teachers — for kids, adults and new Muslims alike.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        {courses.length === 0 ? (
          <p className="text-center text-sm text-muted">No courses published yet — check back soon.</p>
        ) : (
          <div className="reveal grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  slug: course.slug,
                  title: course.title,
                  shortDescription: course.shortDescription,
                  heroImage: course.heroImage,
                  icon: course.icon,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
