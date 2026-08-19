import type { Metadata } from "next";
import Link from "next/link";
import { HeroBadge, HeroGlow } from "@/components/hero-background";

const aboutDescription =
  "Ahsan Ul Quran Academy connects students worldwide with certified teachers for one-on-one online Quran, Tajweed, Hifz and Islamic Studies classes.";

export const metadata: Metadata = {
  title: "About",
  description: aboutDescription,
  alternates: { canonical: "/about" },
  openGraph: { title: "About — Ahsan Ul Quran Academy", description: aboutDescription, url: "/about" },
  twitter: { card: "summary_large_image", title: "About — Ahsan Ul Quran Academy", description: aboutDescription },
};

const values = [
  {
    title: "Ijazah-certified teachers",
    desc: "Every teacher is certified and experienced in teaching Quran and Islamic Studies to both kids and adults.",
  },
  {
    title: "Personal attention",
    desc: "Only one-on-one classes — never crowded group sessions where students get lost.",
  },
  {
    title: "Built around your life",
    desc: "Flexible scheduling across timezones, so learning fits your family's routine, not the other way around.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="relative overflow-hidden text-center px-6 pt-20 pb-6">
        <HeroGlow />
        <div className="relative max-w-2xl mx-auto">
          <HeroBadge label="ABOUT US" />
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Teaching the Quran,
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-lighter to-primary bg-clip-text text-transparent">
              one student at a time
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed">
            Ahsan Ul Quran Academy was founded to make quality Quran education accessible to
            every family, anywhere in the world — through certified teachers and real,
            one-on-one attention.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="reveal grid gap-6 md:grid-cols-2 mb-20">
          <div className="rounded-[24px] border border-black/10 bg-white p-7 sm:p-9">
            <div className="label text-[11.5px] text-primary">OUR MISSION</div>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
              We started this academy because we believe learning the Quran shouldn&apos;t be
              limited by geography. Every student — whether a young child taking their first
              steps in Noorani Qaida, an adult memorizing for the first time, or a new Muslim
              learning to read Arabic — deserves a dedicated teacher and a class built around them.
            </p>
            <p className="mt-3.5 text-[15px] leading-relaxed text-foreground/85">
              Every class carries the same promise: patient, personal, one-on-one teaching that
              respects where each student is on their journey.
            </p>
          </div>
          <div className="grid gap-6 content-start">
            {values.map((v) => (
              <div key={v.title} className="rounded-[24px] border border-black/10 bg-white p-6.5">
                <div className="font-semibold text-[16px]">{v.title}</div>
                <div className="mt-2 text-[13.5px] leading-relaxed text-muted">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="reveal text-center rounded-[28px] border border-black/10 px-8 py-14 sm:py-16 bg-[radial-gradient(ellipse_70%_120%_at_50%_-20%,rgba(20,52,92,0.10),rgba(255,255,255,0.6)_60%)]"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Start your journey today</h2>
          <p className="mx-auto mt-3.5 max-w-md text-[15px] text-muted leading-relaxed">
            Book a free trial class and meet your teacher — no obligation.
          </p>
          <Link
            href="/trial"
            className="mt-6.5 inline-block rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(20,52,92,0.35)] transition hover:bg-primary-light"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
