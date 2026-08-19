import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { HeroBadge, HeroGlow } from "@/components/hero-background";
import PricingCard from "@/components/pricing-card";
import FaqAccordion from "@/components/faq-accordion";

// Rendered per-request rather than at build time — the database isn't
// reachable during `next build` on Hostinger, only at runtime.
export const dynamic = "force-dynamic";

const description =
  "Simple, transparent pricing for one-on-one online Quran classes — every plan includes a free trial class.";

export const metadata: Metadata = {
  title: "Pricing",
  description,
  alternates: { canonical: "/pricing" },
  openGraph: { title: "Pricing — Ahsan Ul Quran Academy", description, url: "/pricing" },
  twitter: { card: "summary_large_image", title: "Pricing — Ahsan Ul Quran Academy", description },
};

const faqs = [
  {
    question: "Is the free trial class really free?",
    answer: "Yes — every plan includes one free trial class with no obligation to continue.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can move to a different plan at any time as your schedule or goals change.",
  },
  {
    question: "What if I want 60-minute classes instead of 30?",
    answer: "Every plan can be upgraded to 60-minute classes — see the alternate pricing note on each plan.",
  },
  {
    question: "Is there a contract or long-term commitment?",
    answer: "No. Plans are billed monthly and you can cancel anytime.",
  },
];

export default async function PricingPage() {
  const plans = await prisma.pricingPlan.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="relative overflow-hidden text-center px-6 pt-20 pb-6">
        <HeroGlow />
        <div className="relative max-w-2xl mx-auto">
          <HeroBadge label="PRICING" />
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Simple, transparent
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-lighter to-primary bg-clip-text text-transparent">
              plans
            </span>
          </h1>
          <p className="mt-5 text-base text-muted leading-relaxed">
            Every plan includes a free trial class and one-on-one live sessions with a certified teacher.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        {plans.length === 0 ? (
          <p className="text-center text-sm text-muted">Pricing plans coming soon.</p>
        ) : (
          <div className="reveal grid gap-6 sm:grid-cols-3 items-start">
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
        )}

        <div className="reveal mx-auto max-w-2xl mt-20">
          <div className="text-center mb-8">
            <div className="label text-[11.5px] text-primary">FAQ</div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">Pricing questions</h2>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  );
}
