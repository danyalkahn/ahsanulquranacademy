import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { HeroBadge, HomeHeroBackground } from "@/components/hero-background";
import CourseCard from "@/components/course-card";
import PricingCard from "@/components/pricing-card";
import ReviewCard from "@/components/review-card";
import FaqAccordion from "@/components/faq-accordion";

// Rendered per-request rather than at build time — the database isn't
// reachable during `next build` on Hostinger, only at runtime.
export const dynamic = "force-dynamic";

const homeTitle = "Ahsan Ul Quran Academy — Online Quran & Islamic Studies Classes";
const description =
  "Learn Quran, Tajweed, Hifz and Arabic online with certified teachers in one-on-one live classes — flexible scheduling, a free trial class, for kids and adults worldwide.";

export const metadata: Metadata = {
  description,
  alternates: { canonical: "/" },
  openGraph: { title: homeTitle, description, url: "/" },
  twitter: { card: "summary_large_image", title: homeTitle, description },
};

const highlights = [
  {
    icon: "🎓",
    title: "Certified teachers",
    blurb: "Every teacher is Ijazah-certified and experienced in teaching kids and adults alike.",
  },
  {
    icon: "🕌",
    title: "One-on-one classes",
    blurb: "Personal, live sessions — no group classes, no lost attention.",
  },
  {
    icon: "🕒",
    title: "Flexible scheduling",
    blurb: "Book classes around your timezone and daily routine, 7 days a week.",
  },
];

const steps = [
  { step: "STEP 01", title: "Book a free trial", desc: "Tell us your goals — we match you with the right teacher." },
  { step: "STEP 02", title: "Meet your teacher", desc: "A live 30-minute trial class, no obligation." },
  { step: "STEP 03", title: "Start learning", desc: "Weekly one-on-one classes at a pace built for you." },
  { step: "STEP 04", title: "Track progress", desc: "Regular progress reports so you can see the growth." },
];

const faqs = [
  {
    question: "What courses does Ahsan Ul Quran Academy offer?",
    answer:
      "Quran reading for kids and adults, Tajweed, Hifz (memorization), Noorani Qaida for beginners, classes for new Muslims, Arabic language, and Islamic Studies — all one-on-one, online.",
  },
  {
    question: "Is the free trial really free?",
    answer:
      "Yes. Every pricing plan includes a free trial class with no obligation to continue — it's how we match you with the right teacher.",
  },
  {
    question: "What ages do you teach?",
    answer:
      "All ages — we have dedicated programs and teachers experienced with young children as well as adult beginners and new Muslims.",
  },
  {
    question: "Do I need any prior knowledge to start?",
    answer:
      "No. Our Noorani Qaida course starts from the Arabic alphabet for complete beginners, and every plan is paced to the student.",
  },
  {
    question: "How do online classes work?",
    answer:
      "Classes are live, one-on-one video sessions with your teacher at a time you choose. You just need a phone, tablet or computer and an internet connection.",
  },
  {
    question: "How do I get started?",
    answer: "Start with a free trial class — tell us what you'd like to learn and we'll take it from there.",
  },
];

export default async function HomePage() {
  const [courses, plans, reviews] = await Promise.all([
    prisma.course.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, take: 6 }),
    prisma.pricingPlan.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.review.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, take: 3 }),
  ]);

  const ratedReviews = reviews.filter((r) => r.rating);
  const reviewsJsonLd =
    ratedReviews.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Ahsan Ul Quran Academy",
          review: ratedReviews.map((r) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            author: { "@type": "Person", name: r.clientName },
            reviewBody: r.quote,
          })),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              ratedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedReviews.length
            ).toFixed(1),
            reviewCount: ratedReviews.length,
          },
        }
      : null;

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[78px] overflow-hidden pt-[78px]">
        <HomeHeroBackground />
        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
          <HeroBadge label="ONLINE QURAN ACADEMY" />
          <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.02]">
            Learn Quran
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-lighter to-primary bg-clip-text text-transparent">
              with confidence
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted leading-relaxed">
            One-on-one live Quran, Tajweed, Hifz and Arabic classes with certified teachers —
            for kids and adults, anywhere in the world.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/trial"
              className="rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(20,52,92,0.35)] transition hover:bg-primary-light hover:-translate-y-0.5"
            >
              Start Free Trial
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-black/10 bg-white px-7 py-3.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              Explore courses
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="reveal mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-3">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-black/10 bg-white p-6 transition hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="text-2xl">{h.icon}</div>
              <h3 className="mt-4 font-semibold text-lg">{h.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{h.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      {courses.length > 0 && (
        <section className="reveal mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="label text-[11.5px] text-primary">OUR COURSES</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">A course for every learner</h2>
            </div>
            <Link href="/courses" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>
      )}

      {/* Process */}
      <section className="reveal mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight mb-10">
          How it works
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className={`rounded-2xl border p-6 ${
                i === 3 ? "border-primary/30 bg-primary/5" : "border-black/10 bg-white"
              }`}
            >
              <div className="label text-xs text-primary">{s.step}</div>
              <div className="mt-2.5 font-semibold">{s.title}</div>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      {plans.length > 0 && (
        <section className="reveal mx-auto max-w-6xl px-6 py-16">
          <div className="text-center mb-12">
            <div className="label text-[11.5px] text-primary">PRICING</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Simple, transparent plans</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              Every plan includes a free trial class. Cancel anytime.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 items-start">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={{
                  slug: plan.slug,
                  name: plan.name,
                  tagline: plan.tagline,
                  price: plan.price,
                  billingPeriod: plan.billingPeriod,
                  classesPerWeek: plan.classesPerWeek,
                  classesPerMonth: plan.classesPerMonth,
                  minutesPerClass: plan.minutesPerClass,
                  altPricingNote: plan.altPricingNote,
                  features: Array.isArray(plan.features) ? (plan.features as string[]) : [],
                  highlighted: plan.highlighted,
                  ctaLabel: plan.ctaLabel,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="reveal mx-auto max-w-6xl px-6 py-16">
          {reviewsJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
            />
          )}
          <div className="text-center mb-10">
            <div className="label text-[11.5px] text-primary">STUDENT & PARENT REVIEWS</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Trusted by families worldwide</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="reveal mx-auto max-w-3xl px-6 py-16">
        <div className="text-center mb-10">
          <div className="label text-[11.5px] text-primary">FAQ</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Common questions</h2>
        </div>
        <FaqAccordion faqs={faqs} />
      </section>

      {/* CTA */}
      <section className="reveal relative mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Ready to begin your Quran journey?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15.5px] text-muted leading-relaxed">
          Book a free trial class today — no obligation, just a real class with a real teacher.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <Link
            href="/trial"
            className="rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(20,52,92,0.35)] transition hover:bg-primary-light hover:-translate-y-0.5"
          >
            Start Free Trial
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-black/10 px-8 py-3.5 text-sm text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
