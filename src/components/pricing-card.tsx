import Link from "next/link";

export type PricingPlanData = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  billingPeriod: string;
  classesPerWeek: number;
  classesPerMonth: number;
  minutesPerClass: number;
  altPricingNote?: string | null;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
};

export default function PricingCard({ plan }: { plan: PricingPlanData }) {
  return (
    <div
      className={`relative flex flex-col rounded-[26px] border p-7 sm:p-8 ${
        plan.highlighted
          ? "border-primary bg-gradient-to-b from-primary/[0.07] to-transparent shadow-[0_20px_50px_rgba(15,110,79,0.14)]"
          : "border-black/10 bg-white"
      }`}
    >
      {plan.highlighted && (
        <span className="label absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[11px] text-white shadow-sm">
          ⭐ Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold">{plan.name}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed min-h-[40px]">{plan.tagline}</p>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
        <span className="text-sm text-muted-2">/{plan.billingPeriod}</span>
      </div>

      <div className="mt-4 rounded-xl bg-black/[0.03] px-4 py-3 text-sm text-foreground/85">
        {plan.classesPerWeek} classes/week ({plan.classesPerMonth}/month)
        <br />
        {plan.minutesPerClass} min/class
      </div>

      {plan.altPricingNote && (
        <p className="mt-3 text-xs text-muted-2 italic">{plan.altPricingNote}</p>
      )}

      <ul className="mt-6 space-y-2.5 text-sm flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <span className="mt-0.5 text-primary">✓</span>
            <span className="text-foreground/85">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/trial?plan=${plan.slug}`}
        className={`mt-7 block rounded-xl py-3.5 text-center text-sm font-semibold transition ${
          plan.highlighted
            ? "bg-primary text-white hover:bg-primary-light shadow-[0_10px_30px_rgba(15,110,79,0.35)]"
            : "border border-primary/40 text-primary hover:bg-primary/5"
        }`}
      >
        {plan.ctaLabel}
      </Link>
    </div>
  );
}
